var LoyaltyConditions = require("../models/LoyaltyConditions");

var homeController = {};

homeController.homePage = function (req, res, next) {
	if (req.user) {
		res.render("index", { title: "HomePage", token: req.cookies["token"], user: req.user });
	} else {
		res.render("index", { title: "HomePage", token: req.cookies["token"] });
	}
};

homeController.login = function (req, res, next) {
	if (req.cookies["token"]) {
		res.redirect("/");
	}
	res.render("login", { title: "Login" });
};

homeController.register = function (req, res, next) {
	if (req.cookies["token"]) {
		res.redirect("/");
	}
	res.render("register", { title: "Register" });
};

homeController.profile = async function (req, res, next) {
	const loyaltyConditions = await LoyaltyConditions.find().exec();
	res.render("profile", {
		token: req.cookies["token"],
		user: req.user,
		title: "Profile",
		loyaltyConditions: loyaltyConditions,
		transactions: req.user.purchases,
	});
};

homeController.logout = function (req, res, next) {
	res.clearCookie("token");
	res.redirect("/");
};

homeController.bookList = function (req, res, next) {
	res.render("bookList", { token: req.cookies["token"], user: req.user, title: "Book List" });
};

module.exports = homeController;
