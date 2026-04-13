import express from 'express'
import { placeOrder, placeOrderPaystack, verifyPaystack, allOrders, userOrders, updateStatus } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/paystack', authUser, placeOrderPaystack)
orderRouter.post('/verify-paystack', authUser, verifyPaystack)

// User feature
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter
