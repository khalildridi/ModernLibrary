const mongoose = require("mongoose");

const LoyaltyConditionsSchema = new mongoose.Schema({
	percentages: [],
	ages: [],
	numAcquisitions: [],
	numSoldBooks: [],
	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LoyaltyConditions", LoyaltyConditionsSchema);
