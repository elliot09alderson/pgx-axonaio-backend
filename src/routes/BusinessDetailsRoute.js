const { fetchBusinessDetails, createBusinessDetails } = require('../controllers/BusinessDetailController');
const { verifyToken } = require('../middleware/authorization');
// const { tokenVerify } = require('../middleware/tokenVerify');

const router = require('express').Router();

router.get('/fetch', verifyToken, fetchBusinessDetails)
router.put('/businessdetails', verifyToken, createBusinessDetails);

module.exports = router