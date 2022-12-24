const { update } = require("../models/LoyaltyConditions");
var LoyaltyConditions = require("../models/LoyaltyConditions");

var loyaltyConditionsController = {};

loyaltyConditionsController.show = function (req, res, next) {
	LoyaltyConditions.find({}, req.query.condition).exec(function (err, loyaltyConditions) {
		if (err) {
			console.log("Error", err);
			next(err);
		} else {
			res.json(loyaltyConditions);
		}
	});
};

loyaltyConditionsController.edit = function (req, res, next) {
	const updateQuery = {};
	updateQuery[req.params.condition] = req.body;

	LoyaltyConditions.findOneAndUpdate(
		{},
		{
			$set: updateQuery,
		},
		{ new: true },
		function (err, editedLoyaltyConditions) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.json(editedLoyaltyConditions);
			}
		}
	);
};

module.exports = loyaltyConditionsController;
