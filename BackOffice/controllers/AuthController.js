const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../jwt_secret/config");

var authController = {};

authController.login = function (req, res) {
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err) return res.render("../views/login", { msg: true });
		if (!user) return res.render("../views/login", { msg: true });

		// check if the password is valid
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

		if (!passwordIsValid) return res.render("../views/login", { msg: true });

		// if user is found and password is valid
		// create a token
		var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
			expiresIn: 86400, // expires in 24 hours
		});

		// return the information including token as JSON
		res.cookie("token", token);
		res.redirect("/");
		//res.status(200).send({ auth: true, token: token });
	});
};

authController.register = function (req, res) {
	var hashedPassword = bcrypt.hashSync(req.body.password, 10);

	req.body.password = hashedPassword;

	User.create(req.body, function (err, user) {
		if (err) return res.status(500).json(err);

		// if user is registered without errors
		// create a token
		var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
			expiresIn: 86400, // expires in 24 hours
		});

		//res.render("../views/index", { auth: true, token: token });
		res.status(200).send({ auth: true, token: token });
	});
};

authController.getId = function (req, res, next) {
	var token = req.cookies["token"] || req.headers["x-access-token"];
	console.log(token);
	if (!token) {
		req.userId = null;
		next();
	}

	jwt.verify(token, config.secret, function (err, decoded) {
		if (err) {
			req.userId = null;
			next();
		}

		User.findOne({ _id: decoded.id }, function (err, user) {
			req.user = user;
			next();
		});
	});
};

authController.verifyToken = function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.cookies["token"] || req.headers["x-access-token"];
	console.log(token);
	if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

	// verifies secret and checks exp
	jwt.verify(token, config.secret, function (err, decoded) {
		if (err) return res.status(500).send({ auth: false, message: "Failed to authenticate token." });

		// if everything is good, save to request for use in other routes
		req.userId = decoded.id;
		next();
	});
};

authController.verifyTokenEmployee = function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.cookies["token"] || req.headers["x-access-token"];
	if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

	// verifies secret and checks exp
	jwt.verify(token, config.secret, function (err, decoded) {
		if (err || decoded.role == "Client")
			return res
				.status(500)
				.send({ auth: false, message: "Failed to authenticate token or not Employee" });
		// if everything is good, save to request for use in other routes
		req.userId = decoded.id;
		next();
	});
};

authController.verifyTokenAdmin = function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.cookies["token"] || req.headers["x-access-token"];
	if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

	// verifies secret and checks exp
	jwt.verify(token, config.secret, function (err, decoded) {
		if (err || decoded.role !== "Admin")
			return res
				.status(500)
				.send({ auth: false, message: "Failed to authenticate token or not Admin" });
		// if everything is good, save to request for use in other routes
		req.userId = decoded.id;
		next();
	});
};

module.exports = authController;
