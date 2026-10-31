const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  qty:   { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, min: 1 },
    items:       { type: [OrderItemSchema], required: true },
    status: {
      type:    String,
      enum:    ['pending', 'preparing', 'ready', 'served'],
      default: 'pending',
    },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
