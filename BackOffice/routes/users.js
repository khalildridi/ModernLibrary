const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

// Get all users
router.get("/", authController.verifyTokenEmployee, authController.getId, function (req, res) {
	res.render("../views/users/index", {
		token: req.cookies["token"],
		user: req.user,
		title: "CRUD Users",
	});
});

module.exports = router;
