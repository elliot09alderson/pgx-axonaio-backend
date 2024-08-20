const { fetchBankingDetails, createBankingDetails } = require('../controllers/BankingDetailsController');
const { verifyToken } = require('../middleware/authorization');

const router = require('express').Router();

router.get('/fetch', verifyToken, fetchBankingDetails)

router.put("/create", verifyToken, createBankingDetails);
module.exports = router;