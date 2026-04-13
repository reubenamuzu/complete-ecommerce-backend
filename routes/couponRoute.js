import express from 'express'
import { applyCoupon, createCoupon, listCoupons, deleteCoupon } from '../controllers/couponController.js'
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const couponRouter = express.Router()

couponRouter.post('/apply', authUser, applyCoupon)
couponRouter.post('/create', adminAuth, createCoupon)
couponRouter.get('/list', adminAuth, listCoupons)
couponRouter.post('/delete', adminAuth, deleteCoupon)

export default couponRouter
