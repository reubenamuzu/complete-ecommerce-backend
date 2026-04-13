import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true},
    statusHistory: { type: Array, default: [] },
    couponCode: { type: String, default: '' },
    discount: { type: Number, default: 0 }
})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;