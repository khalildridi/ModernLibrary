const express = require("express");
const router = express.Router();
const userRestController = require("../controllers/UserRestController.js");
const validationController = require("../controllers/ValidationController");
const authController = require("../controllers/AuthController");

// Get all users
router.get("/", authController.verifyTokenEmployee, userRestController.showAll);

//Search
router.get("/search", authController.verifyTokenEmployee, userRestController.search);

// Get single user by id
router.get("/show/:id", authController.verifyTokenEmployee, userRestController.show);

// Create user
router.post(
  "/create",
  authController.verifyTokenEmployee,
  validationController.validateUserCreate,
  userRestController.create
);

// Edit user
router.put(
  "/edit/:id",
  authController.verifyToken,
  //validationController.validateUserEdit,
  userRestController.edit
);

// Delete user
router.delete("/delete/:id/:userid", authController.verifyTokenEmployee, userRestController.delete);

// Register purchases
router.put(
  "/registerPurchase/:email",
  authController.verifyToken,
  //validationController.validateBookPurchase,
  userRestController.registerPurchase
);

module.exports = router;
