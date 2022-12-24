const express = require("express");
const router = express.Router();
const bookRestController = require("../controllers/BookRestController.js");
const validationController = require("../controllers/ValidationController");
const authController = require("../controllers/AuthController");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, "./public/images/uploads");
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + "-" + file.originalname);
	},
});
const upload = multer({ storage: storage });

// Get all book
router.get("/", bookRestController.showAll);

//Search
router.get("/search", bookRestController.search);

// Get single book by id
router.get("/show/:id", bookRestController.show);

// Create user
router.post(
	"/create",
	upload.single("cover"),
	authController.verifyTokenEmployee,
	validationController.validateBook,
	bookRestController.create
);

// Edit book
router.put(
	"/edit/:id",
	upload.single("cover"),
	authController.verifyTokenEmployee,
	validationController.validateBook,
	bookRestController.edit
);

// Register reviews
router.put(
	"/registerReview/:id",
	//authController.verifyTokenEmployee,
	//validationController.validateBook,
	bookRestController.registerReview
);

// Delete user
router.delete("/delete/:id/:userid", authController.verifyTokenEmployee, bookRestController.delete);

module.exports = router;
