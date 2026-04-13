import express from 'express'
import { requestReturn, getUserReturns, allReturns, updateReturnStatus } from '../controllers/returnController.js'
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const returnRouter = express.Router()

returnRouter.post('/request', authUser, requestReturn)
returnRouter.post('/user', authUser, getUserReturns)
returnRouter.get('/list', adminAuth, allReturns)
returnRouter.post('/status', adminAuth, updateReturnStatus)

export default returnRouter
