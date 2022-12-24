var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var auth = require("../controllers/AuthController.js");

router.post("/login", auth.login);
router.post("/register", auth.register);

module.exports = router;
