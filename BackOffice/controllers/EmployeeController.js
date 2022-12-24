var mongoose = require("mongoose");
var Employee = require("../models/User");

var employeeController = {};

// Show all employees
employeeController.list = function (req, res) {
	Employee.find().exec(function (err, employee) {
		if (err) {
			console.log("Error", err);
		} else {
			res.render("../views/employees/index", {
				employees: employee,
				token: req.cookies["token"],
				user: req.user,
				title: "CRUD Employees",
			});
		}
	});
};

// Show employee by id
employeeController.show = function (req, res) {
	Employee.findOne({ _id: req.params.id }).exec(function (err, employee) {
		if (err) {
			console.log("Error", err);
		} else {
			res.render("../views/employees/show", { employee: employee });
		}
	});
};

employeeController.create = function (req, res) {
	res.render("../views/employees/create");
};

// Save new employee
employeeController.save = function (req, res) {
	var employee = new Employee(req.body);

	employee.save(function (err) {
		if (err) {
			console.log(err);
			res.render("../views/employees/create");
		} else {
			console.log("Successfully created an employee.");
			res.redirect("/employees/show/" + employee._id);
		}
	});
};

module.exports = employeeController;
