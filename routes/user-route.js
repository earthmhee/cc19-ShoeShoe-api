const express = require('express')
const { getMyAccount, createUpdateAccount } = require('../controllers/user-controller')
const authenticate = require('../middlewares/authenticate')
const userRoute = express.Router()

userRoute.get('/my-account', authenticate, getMyAccount)
userRoute.put('/update-account', authenticate, createUpdateAccount)

module.exports = userRoute