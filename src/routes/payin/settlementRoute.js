
var express = require('express')
const { verifyToken } = require('../../middleware/authorization')
const { createSettlement, getTodaysSettlement, getSettlementByDate } = require('../../controllers/payin/settlementController');
var router = express.Router()


// create
router.post('/create', verifyToken, createSettlement)
router.get('/fetch', verifyToken, getTodaysSettlement)
router.get("/fetchbydate", verifyToken, getSettlementByDate)

module.exports = router
