const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../jwt_secret/config");

var authController = {};
authController.login = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
      expiresIn: 86400, // expires in 24 hours
    });
    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token });
  });
};
authController.logout = function (req, res) {
  res.status(200).send({ auth: false, token: null });
};
authController.register = function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      contact: req.body.contact,
      date_of_birth: req.body.birth_date,
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user`.");
      // if user is registered without errors
      // create a token
      var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    }
  );
};

authController.getId = function (req, res, next) {
  var token = req.headers["x-access-token"];
  console.log(token);
  if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: "Failed to authenticate token." });

    User.findOne({ _id: decoded.id }, function (err, user) {
      req.user = user;
      res.status(200).send({ auth: true, user: user });
    });
  });
};

//middleware
authController.verifyToken = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["x-access-token"];
  if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: "Failed to authenticate token." });
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};
authController.verifyRoleAdmin = function (req, res, next) {
  User.findById(req.userId, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    if (user.role === "admin") {
      next();
    } else {
      return res.status(403).send({ auth: false, message: "Not authorized!" });
    }
  });
};
module.exports = authController;
