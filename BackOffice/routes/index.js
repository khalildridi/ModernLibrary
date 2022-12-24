var express = require("express");
const authController = require("../controllers/AuthController");
const homeController = require("../controllers/HomePageController");
var router = express.Router();

/* GET home page. */
router.get("/", authController.getId, homeController.homePage);

/* GET login page. */
router.get("/login", homeController.login);

/* GET register page. */
router.get("/register", homeController.register);

/* GET profile page. */
router.get("/profile", authController.verifyToken, authController.getId, homeController.profile);

/* Logout */
router.get("/logout", homeController.logout);

/* GET book list page. */
router.get("/bookList", authController.verifyToken, authController.getId, homeController.bookList);

module.exports = router;
