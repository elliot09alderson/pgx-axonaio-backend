var express = require('express')
const { categoryCreate } = require('../controllers/categoryController')
var  router = express.Router()

// create app 
router.post('/create', categoryCreate)

module.exports = router