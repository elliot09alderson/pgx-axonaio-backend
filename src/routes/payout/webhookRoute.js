
var express = require('express')
const { verifyToken } = require("../../middleware/authorization")
const { createWebhook, get_webhook, updateWebhook, deleteWebhook } = require('../../controllers/payout/webhookController');
var router = express.Router()


// create
router.post('/create', verifyToken ,createWebhook)
router.get('/fetch', verifyToken, get_webhook)
router.put('/update/:id', verifyToken, updateWebhook)
router.delete('/delete/:id', verifyToken, deleteWebhook)

module.exports = router
