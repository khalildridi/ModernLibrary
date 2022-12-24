var express = require("express");
var router = express.Router();
var authController = require("../controllers/AuthRestController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);
router.post("/getId", authController.getId);

module.exports = router;
