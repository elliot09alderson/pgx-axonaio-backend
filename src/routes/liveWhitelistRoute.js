
var express = require('express')
const { createLiveWhitelist, getAllWhitelist , updateWhitelist, deleteLiveWhitelist  } = require('../controllers/liveWhitelistController')
const { verifyToken } = require('../middleware/authorization')
const { body } = require('express-validator');
var router = express.Router()


// create
router.post('/create', verifyToken ,createLiveWhitelist)
router.get('/fetch', verifyToken, getAllWhitelist)
router.put('/update', verifyToken, updateWhitelist)
router.delete('/delete', verifyToken, deleteLiveWhitelist)


module.exports = router
