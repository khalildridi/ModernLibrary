var User = require("../models/User");
const bcrypt = require("bcryptjs");
const Book = require("../models/Book");
var ObjectID = require("bson").ObjectID;

var userController = {};

userController.search = function (req, res, next) {
	let searchContent = req.query.searchContent || "";
	let page = req.query.page || 1;
	let perPage = req.query.perPage || 5;
	var query = {
		$or: [
			{ name: { $regex: searchContent, $options: "i" } },
			{ email: { $regex: searchContent, $options: "i" } },
		],
		deleted_at: null,
	};
	const myCustomLabels = {
		docs: "users",
	};

	const options = {
		page: page,
		limit: perPage,
		customLabels: myCustomLabels,
	};

	User.paginate(query, options, function (err, results) {
		if (err) {
			console.log("Error", err);
			next(err);
		} else {
			res.json(results);
		}
	});
};

// Show all employees
userController.showAll = function (req, res, next) {
	User.find({ deleted_at: null }).exec(function (err, results) {
		if (err) {
			console.log("Error", err);
			next(err);
		} else {
			res.json(results);
		}
	});
};

// Show employee by id
userController.show = function (req, res, next) {
	User.findOne({ _id: req.params.id, deleted_at: null }).exec(function (err, user) {
		if (err) {
			console.log("Error", err);
			next(err);
		} else {
			res.json(user);
		}
	});
};

// Save new employee
userController.create = function (req, res, next) {
	if (!req.body.password) {
		req.body.password = bcrypt.hashSync("123", 10);
	}
	const createdUser = new User(req.body);
	createdUser.save(function (err) {
		if (err) {
			console.log(err);
			next(err);
		} else {
			res.json(createdUser);
		}
	});
};

userController.edit = function (req, res, next) {
	const updateQuery = {
		name: req.body.name,
		email: req.body.email,
		//date_of_birth: req.body.date_of_birth,
		contact: req.body.contact,
		address: {
			street: req.body?.street,
			city: req.body?.city,
			district: req.body?.district,
			zipCode: req.body?.zipCode,
		},
		updated_at: new Date(),
	};
	if (req.body?.role) {
		updateQuery.role = req.body.role;
	}
	User.findByIdAndUpdate(
		req.params.id,
		{
			$set: updateQuery,
		},
		{ new: true },
		function (err, editedUser) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.json(editedUser);
			}
		}
	);
};

userController.delete = function (req, res, next) {
	User.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				deleted_at: new Date(),
				deleted_by: req.params.userid,
			},
		},
		{ new: true },
		function (err, deletedUser) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.json(deletedUser);
			}
		}
	);
};

// Save new employee
userController.registerPurchase = function (req, res, next) {
	if (req.body.id == undefined || req.body.id == null || req.body.id == "")
		req.body._id = new ObjectID();

	for (book of req.body.books) {
		if (book.maxQtNew && book.maxQtWorn) {
			Book.findByIdAndUpdate(
				{ _id: book._id },
				{
					new: book.maxQtNew - book.new,
					worn: book.maxQtWorn - book.worn,
				},
				function (err, updatedBook) {
					if (err) {
						console.log(err);
						next(err);
					} else {
						console.log("Updated book");
					}
				}
			);

			delete book.maxQtNew;
			delete book.maxQtWorn;
		}
	}

	let newPoints;
	if (req.body.discount > 0) {
		newPoints = parseInt(1 + (req.body.totalPrice + req.body.discount) * 0.15) - 25;
	} else {
		newPoints = parseInt(1 + req.body.totalPrice * 0.15);
	}

	User.findOneAndUpdate(
		{ email: req.params.email },
		{
			$inc: {
				points: newPoints,
			},
			$push: {
				purchases: req.body,
			},
		},
		{ new: true },
		function (err, updatedUser) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.json(updatedUser);
			}
		}
	);
};

module.exports = userController;
