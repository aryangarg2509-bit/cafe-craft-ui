import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coffee, Package, Leaf, Milk, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { mockInventory } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const iconMap = {
  Coffee: Coffee,
  Package: Package,
  Leaf: Leaf,
  Milk: Milk
};

const InventoryPage = () => {
  const getStockStatus = (current: number, max: number, threshold: number) => {
    const percentage = (current / max) * 100;
    if (current <= threshold) return { status: 'critical', variant: 'destructive' as const };
    if (percentage < 30) return { status: 'low', variant: 'secondary' as const };
    if (percentage < 70) return { status: 'medium', variant: 'outline' as const };
    return { status: 'good', variant: 'default' as const };
  };

  const getProgressVariant = (current: number, max: number, threshold: number) => {
    const percentage = (current / max) * 100;
    if (current <= threshold) return 'danger';
    if (percentage < 30) return 'warning';
    return 'success';
  };

  const chartData = mockInventory.map(item => ({
    name: item.name.split(' ')[0], // Shortened name for chart
    current: item.currentStock,
    max: item.maxStock,
    percentage: (item.currentStock / item.maxStock) * 100
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage your cafe's inventory levels
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Inventory Chart */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle>Stock Levels Overview</CardTitle>
          <CardDescription>Current stock percentage by item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Stock Level']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockInventory.map((item) => {
          const percentage = (item.currentStock / item.maxStock) * 100;
          const stockStatus = getStockStatus(item.currentStock, item.maxStock, item.lowStockThreshold);
          const progressVariant = getProgressVariant(item.currentStock, item.maxStock, item.lowStockThreshold);
          const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Package;
          
          return (
            <Card key={item.id} className="border-0 shadow-soft hover:shadow-warm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="text-sm">{item.category}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={stockStatus.variant} className="capitalize">
                    {stockStatus.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock Level</span>
                    <span className="font-medium">
                      {item.currentStock}/{item.maxStock} {item.unit}
                    </span>
                  </div>
                  <Progress value={percentage} variant={progressVariant} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low threshold: {item.lowStockThreshold} {item.unit}</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-sm">
                    {percentage > 70 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-muted-foreground">
                      {percentage > 70 ? 'Well Stocked' : 'Needs Attention'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryPage;