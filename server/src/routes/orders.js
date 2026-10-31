const express = require('express');
const Order   = require('../models/Order');

const router = express.Router();

// ─── GET /api/orders ───────────────────────────────────────────────────────────
// Returns all orders, newest first.
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('[GET /api/orders]', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ─── POST /api/orders ──────────────────────────────────────────────────────────
// Creates a new order and emits "order:new" via Socket.IO after DB save.
router.post('/', async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    if (!tableNumber || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'tableNumber and at least one item are required' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = await Order.create({ tableNumber, items, total });

    // Emit only after a successful DB save
    const io = req.app.get('io');
    io.emit('order:new', order);

    res.status(201).json(order);
  } catch (err) {
    console.error('[POST /api/orders]', err.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// ─── PATCH /api/orders/:id/status ─────────────────────────────────────────────
// Updates an order's status and emits "order:updated" via Socket.IO.
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'served'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Emit only after a successful DB save
    const io = req.app.get('io');
    io.emit('order:updated', order);

    res.json(order);
  } catch (err) {
    console.error('[PATCH /api/orders/:id/status]', err.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
