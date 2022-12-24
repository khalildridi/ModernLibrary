const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

// Get all books
router.get("/", authController.verifyTokenEmployee, authController.getId, function (req, res) {
	res.render("../views/books/index", {
		token: req.cookies["token"],
		user: req.user,
		title: "CRUD Books",
	});
});

module.exports = router;
