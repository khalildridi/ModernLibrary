var express = require("express");
var router = express.Router();
var employee = require("../controllers/EmployeeController.js");
const authController = require("../controllers/AuthController");

// Get all employees
router.get("/", authController.verifyTokenAdmin, authController.getId, employee.list);

// Get single employee by id
router.get("/show/:id", function (req, res) {
	employee.show(req, res);
});

// Create employee
router.get("/create", function (req, res) {
	employee.create(req, res);
});

// Save employee
router.post("/save", function (req, res) {
	employee.save(req, res);
});

module.exports = router;
