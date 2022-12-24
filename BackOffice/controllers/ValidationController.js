const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Book = require("../models/Book");
const validationController = {};

validationController.validateBook = [
	check("title")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Title can't be empty!")
		.bail()
		.isLength({ min: 3, max: 60 })
		.withMessage("Title must have between 3 and 60 characters!")
		.bail(),
	check("author")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Author can't be empty!")
		.bail()
		.isLength({ min: 3, max: 50 })
		.withMessage("Author must have between 3 and 50 characters!")
		.bail(),
	check("ISBN")
		.trim()
		.not()
		.isEmpty()
		.withMessage("ISBN can't be empty!")
		.bail()
		.isISBN()
		.withMessage("Invalid ISBN")
		.bail(),
	check("genre").trim().not().isEmpty().withMessage("Genre can't be empty!").bail(),
	check("editor")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Editor can't be empty!")
		.bail()
		.isLength({ min: 3, max: 60 })
		.withMessage("Editor must have between 3 and 60 characters!")
		.bail(),
	check("synopsis")
		.not()
		.isEmpty()
		.withMessage("Synopsis can't be empty!")
		.bail()
		.isLength({ min: 50 })
		.withMessage("Synopsis must have at least 50 characters!")
		.bail(),
	check("new")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Quantity of new books can't be empty!")
		.bail()
		.isInt()
		.withMessage("Quantity of new books must be a int value")
		.bail(),
	check("worn")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Quantity of worn books can't be empty!")
		.bail()
		.isInt()
		.withMessage("Quantity of worn books must be a int value")
		.bail(),
	check("number_of_pages")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Number of pages can't be empty!")
		.bail()
		.isInt({ min: 1 })
		.withMessage("Number of pages must be a int value and at least have 1 page")
		.bail(),
	check("price")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Price can't be empty!")
		.bail()
		.isFloat({ min: 1 })
		.withMessage("Price must be numeric and at least 1 €")
		.bail(),
	check("launch_date")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Launch Date can't be empty!")
		.not()
		.matches("/^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2}$/")
		.withMessage("Launch Date must be a date!")
		.bail(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];

validationController.validateBookPurchase = [
	check("email")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Email can't be empty!")
		.isEmail()
		.withMessage("Email must be valid")
		.bail()
		.custom((value) => {
			return User.findOne({ email: value }).then((user) => {
				if (!user) {
					return Promise.reject("Email must exist");
				}
			});
		})
		.bail(),
	check("new")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Quantity of new books can't be empty!")
		.bail()
		.isInt()
		.withMessage("Quantity of new books must be a int value and at least 1")
		.bail()
		.custom((value, { req, loc, path }) => {
			return Book.findOne({ _id: req.body._id }).then((book) => {
				if (value > book?.new) {
					return Promise.reject("The max stock available for new books is " + book?.new);
				}
			});
		})
		.bail(),
	check("worn")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Quantity of worn books can't be empty!")
		.bail()
		.isInt()
		.withMessage("Quantity of worn books must be a int value and at least 1")
		.bail()
		.custom((value, { req, loc, path }) => {
			return Book.findOne({ _id: req.body._id }).then((book) => {
				if (value > book?.worn) {
					return Promise.reject("The max stock available for worn books is " + book?.worn);
				}
				if (req.body.new == 0 && req.body.worn == 0) {
					return Promise.reject(
						"The purchase is not valid since both quantities are zero  " + book?.worn
					);
				}
			});
		})
		.bail(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];

validationController.validateUserCreate = [
	check("email")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Email can't be empty!")
		.isEmail()
		.withMessage("Email must be valid")
		.bail()
		.custom((value, { req, loc, path }) => {
			return User.findOne({ email: value }).then((user) => {
				if (user) {
					return Promise.reject("Email already exists");
				}
			});
		})
		.bail(),
	check("name")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Name can't be empty!")
		.bail()
		.isLength({ min: 2 })
		.withMessage("The name must have at least 2 characters")
		.bail(),
	check("role").trim().not().isEmpty().withMessage("Role can't be empty!").bail().optional().bail(),
	check("contact")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Contact can't be empty!")
		.bail()
		.isNumeric({ min: 9, max: 9 })
		.withMessage("Contact must be numeric")
		.bail()
		.isLength({ min: 9, max: 9 })
		.withMessage("Contact must have 9 digits")
		.bail()
		.not()
		.matches("/9[1236][0-9]{7}|2[1-9]{1,2}[0-9]{7}/")
		.withMessage("Contact must be valid"),
	check("date_of_birth")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Date of birth can't be empty!")
		.not()
		.matches("/^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2}$/")
		.withMessage("Date of birth must be a date!")
		.bail(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];

validationController.validateUserEdit = [
	check("email")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Email can't be empty!")
		.isEmail()
		.withMessage("Email must be valid")
		.bail(),
	check("name")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Name can't be empty!")
		.bail()
		.isLength({ min: 2 })
		.withMessage("The name must have at least 2 characters")
		.bail(),
	check("role").trim().not().isEmpty().withMessage("Role can't be empty!").bail().optional().bail(),
	check("contact")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Contact can't be empty!")
		.bail()
		.isNumeric({ min: 9, max: 9 })
		.withMessage("Contact must be numeric")
		.bail()
		.isLength({ min: 9, max: 9 })
		.withMessage("Contact must have 9 digits")
		.bail()
		.not()
		.matches("/9[1236][0-9]{7}|2[1-9]{1,2}[0-9]{7}/")
		.withMessage("Contact must be valid"),
	check("date_of_birth")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Date of birth can't be empty!")
		.not()
		.matches("/^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2}$/")
		.withMessage("Date of birth must be a date!")
		.bail(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
		next();
	},
];

module.exports = validationController;
