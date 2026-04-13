import express from 'express'
import {
  loginUser, registerUser, adminLogin,
  getProfile, updateProfile,
  addAddress, removeAddress,
  addToWishlist, removeFromWishlist, getWishlist
} from '../controllers/userController.js'
import authUser from '../middleware/auth.js'

const userRouter = express.Router()

// Auth
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

// Profile
userRouter.get('/profile', authUser, getProfile)
userRouter.put('/profile', authUser, updateProfile)

// Addresses
userRouter.post('/address/add', authUser, addAddress)
userRouter.delete('/address/remove', authUser, removeAddress)

// Wishlist
userRouter.post('/wishlist/add', authUser, addToWishlist)
userRouter.post('/wishlist/remove', authUser, removeFromWishlist)
userRouter.get('/wishlist', authUser, getWishlist)

export default userRouter
