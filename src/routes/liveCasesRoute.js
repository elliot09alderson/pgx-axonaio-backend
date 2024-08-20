var express = require("express");
const UAParser = require("ua-parser-js");

const {
  createLiveCases,
  getAllLiveCases,
  updateLivecases,
} = require("../controllers/liveCasesController");
const { verifyToken } = require("../middleware/authorization");
const { body } = require("express-validator");
var router = express.Router();

// Validate request body
const liveCasesValidationRules = [
  body("case_git").notEmpty().withMessage("Case GID is required"),
  body("transaction_gid").notEmpty().withMessage("Transaction GID is required"),
  body("case_amount").isNumeric().withMessage("Case amount must be numeric"),
  body("case_notes")
    .optional()
    .isString()
    .withMessage("Case notes must be a string"),
  body("case_status")
    .isIn(["processed", "processing", "close"])
    .withMessage("Invalid case status"),
  body("user_id").isNumeric().withMessage("User ID must be numeric"),
];

// create
router.post("/create", verifyToken, liveCasesValidationRules, createLiveCases);
router.get("/fetch", verifyToken, getAllLiveCases);
router.put("/update", verifyToken, liveCasesValidationRules, updateLivecases);

// const axios = require('axios');

// var VisitorAPI = function(projectID, successHandler, errorHandler) {
//     axios.get('https://visitorapi-dev.uc.r.appspot.com/api/?pid=' + projectID)
//         .then(response => {
//             successHandler(response.data);
//         })
//         .catch(error => {
//             errorHandler(error.response.status, error.response.data.error);
//         });
// };

// Usage: VisitorAPI(projectID, successHandler, errorHandler);
// VisitorAPI(
//     "om61tWZOjuBBPxTdDlpy",
//     function(data) {
//         console.log(data);
//     },
//     function(errorCode, errorMessage) {
//         console.error(errorCode, errorMessage);
//     }
// );

module.exports = router;
