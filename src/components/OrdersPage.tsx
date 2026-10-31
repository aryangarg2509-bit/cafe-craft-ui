import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClipboardList,
  Plus,
  Trash2,
  Wifi,
  WifiOff,
  Loader2,
  ChefHat,
  CheckCircle2,
  Clock,
  Utensils,
} from 'lucide-react';
import { Order, OrderItem, OrderStatus } from '@/types/cafe';
import socket from '@/lib/socket';
import { useToast } from '@/hooks/use-toast';

const API = import.meta.env.VITE_API_URL as string;

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-800 border-amber-200',   icon: Clock },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-800 border-blue-200',       icon: ChefHat },
  ready:     { label: 'Ready',     color: 'bg-green-100 text-green-800 border-green-200',     icon: CheckCircle2 },
  served:    { label: 'Served',    color: 'bg-gray-100 text-gray-600 border-gray-200',        icon: Utensils },
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pending:   'preparing',
  preparing: 'ready',
  ready:     'served',
  served:    null,
};

// ─── Empty item template ───────────────────────────────────────────────────────
const emptyItem = (): OrderItem & { _key: string } => ({
  _key:  crypto.randomUUID(),
  name:  '',
  qty:   1,
  price: 0,
});

// ─── Component ────────────────────────────────────────────────────────────────

const OrdersPage: React.FC = () => {
  const { toast } = useToast();

  // ── State ──
  const [orders, setOrders]           = useState<Order[]>([]);
  const [loading, setLoading]         = useState(true);
  const [connected, setConnected]     = useState(socket.connected);
  const [updatingId, setUpdatingId]   = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);

  // New-order form state
  const [tableNumber, setTableNumber] = useState('');
  const [items, setItems]             = useState([emptyItem()]);
  const [filter, setFilter]           = useState<OrderStatus | 'all'>('all');

  // Keep a ref to orders so socket callbacks always see fresh state
  const ordersRef = useRef<Order[]>([]);
  ordersRef.current = orders;

  // ── Fetch existing orders ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err) {
        toast({ title: 'Error', description: 'Could not load orders.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ── Socket.IO listeners — cleaned up on unmount ────────────────────────────
  useEffect(() => {
    const onConnect    = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onNewOrder = (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      toast({ title: '🆕 New Order', description: `Table ${order.tableNumber} — $${order.total.toFixed(2)}` });
    };

    const onUpdatedOrder = (updated: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
      toast({
        title: `Order Updated`,
        description: `Table ${updated.tableNumber} → ${STATUS_CONFIG[updated.status].label}`,
      });
    };

    socket.on('connect',       onConnect);
    socket.on('disconnect',    onDisconnect);
    socket.on('order:new',     onNewOrder);
    socket.on('order:updated', onUpdatedOrder);

    // Sync connected state with current socket state
    setConnected(socket.connected);

    return () => {
      socket.off('connect',       onConnect);
      socket.off('disconnect',    onDisconnect);
      socket.off('order:new',     onNewOrder);
      socket.off('order:updated', onUpdatedOrder);
    };
  }, []);

  // ── Place new order ────────────────────────────────────────────────────────
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber || items.some((i) => !i.name || i.qty < 1 || i.price < 0)) {
      toast({ title: 'Validation Error', description: 'Fill in all item fields.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        tableNumber: Number(tableNumber),
        items: items.map(({ name, qty, price }) => ({ name, qty, price })),
      };
      const res = await fetch(`${API}/api/orders`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to place order');
      // The socket event will update the list — no need to push manually here
      setTableNumber('');
      setItems([emptyItem()]);
      toast({ title: '✅ Order placed!' });
    } catch (err) {
      toast({ title: 'Error', description: 'Could not place order.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Advance order status ───────────────────────────────────────────────────
  const handleAdvanceStatus = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    setUpdatingId(order._id);
    try {
      const res = await fetch(`${API}/api/orders/${order._id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      // Socket event handles the list update
    } catch (err) {
      toast({ title: 'Error', description: 'Could not update status.', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Item row helpers ───────────────────────────────────────────────────────
  const updateItem = (key: string, field: keyof OrderItem, value: string | number) => {
    setItems((prev) =>
      prev.map((i) => (i._key === key ? { ...i, [field]: field === 'name' ? value : Number(value) } : i))
    );
  };

  const removeItem = (key: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i._key !== key));
  };

  // ── Filtered orders ────────────────────────────────────────────────────────
  const displayed = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            Orders
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time kitchen order management
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          {connected ? (
            <span className="flex items-center gap-1.5 text-green-600">
              <Wifi className="h-4 w-4" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-red-500">
              <WifiOff className="h-4 w-4" />
              Disconnected
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Place New Order form ── */}
        <Card className="border-0 shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-primary" />
              Place New Order
            </CardTitle>
            <CardDescription>Add items and submit to the kitchen</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  id="tableNumber"
                  type="number"
                  min={1}
                  placeholder="e.g. 4"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  required
                />
              </div>

              {/* Item rows */}
              <div className="space-y-2">
                <Label>Items</Label>
                {items.map((item) => (
                  <div key={item._key} className="flex gap-2 items-center">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem(item._key, 'name', e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Input
                      type="number"
                      min={1}
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => updateItem(item._key, 'qty', e.target.value)}
                      className="w-16"
                      required
                    />
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="$"
                      value={item.price}
                      onChange={(e) => updateItem(item._key, 'price', e.target.value)}
                      className="w-20"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item._key)}
                      disabled={items.length === 1}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-1"
                  onClick={() => setItems((prev) => [...prev, emptyItem()])}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Item
                </Button>
              </div>

              {/* Order total preview */}
              {items.some((i) => i.price > 0) && (
                <p className="text-sm font-medium text-right text-primary">
                  Total: ${items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={submitting}
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Placing…</>
                ) : (
                  'Place Order'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ── Live orders list ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'preparing', 'ready', 'served'] as const).map((s) => (
              <Button
                key={s}
                variant={filter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(s)}
                className={filter === s ? 'bg-primary text-primary-foreground' : ''}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
                {s !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    {orders.filter((o) => o.status === s).length}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Orders */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayed.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <ClipboardList className="h-10 w-10 opacity-30" />
                <p>No orders yet. Place one to see it live!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {displayed.map((order) => {
                const cfg  = STATUS_CONFIG[order.status];
                const next = NEXT_STATUS[order.status];
                const Icon = cfg.icon;

                return (
                  <Card
                    key={order._id}
                    className="border-0 shadow-soft hover:shadow-warm transition-shadow"
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: table + items */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">Table {order.tableNumber}</span>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}
                            >
                              <Icon className="h-3 w-3" />
                              {cfg.label}
                            </span>
                          </div>

                          <ul className="text-sm text-muted-foreground space-y-0.5">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span>{item.name} × {item.qty}</span>
                                <span>${(item.price * item.qty).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex items-center justify-between pt-1 border-t border-border text-sm">
                            <span className="text-muted-foreground">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="font-semibold text-primary">
                              Total: ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Right: advance status button */}
                        {next && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAdvanceStatus(order)}
                            disabled={updatingId === order._id}
                            className="shrink-0 text-xs"
                          >
                            {updatingId === order._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              `Mark ${STATUS_CONFIG[next].label}`
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
