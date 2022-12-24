const express = require("express");
const router = express.Router();
const loyaltyConditionsRestController = require("../controllers/LoyaltyConditionsRestController.js");
const validationController = require("../controllers/ValidationController");
const authController = require("../controllers/AuthController");

// Get all conditions
router.get("/", authController.verifyToken, loyaltyConditionsRestController.show);

// Edit conditions
router.put(
  "/edit/:condition",
  authController.verifyTokenEmployee,
  loyaltyConditionsRestController.edit
);

module.exports = router;
