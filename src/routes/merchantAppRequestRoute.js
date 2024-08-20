
var express = require('express')
const { createAppAccessRequest, fetchAppAccess } = require('../controllers/merchantAppRequestController')
const { verifyToken } = require('../middleware/authorization')
var router = express.Router()

// create
router.post('/create', verifyToken, createAppAccessRequest)
router.get('/fetch', verifyToken, fetchAppAccess)
module.exports = router