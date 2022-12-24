const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: { type: String, default: "123" },
	contact: Number,
	date_of_birth: Date,
	avatar: String,
	address: {
		street: String,
		city: String,
		district: String,
		zipCode: String,
	},
	purchases: [
		{
			_id: mongoose.ObjectId,
			date: Date,
			discount: Number,
			totalPrice: Number,
			books: [
				{
					_id: mongoose.ObjectId,
					title: String,
					cover: String,
					price: Number,
					new: Number,
					worn: Number,
				},
			],
		},
	],
	role: { type: String, default: "Client" },
	points: { type: Number, default: 0 },
	updated_at: { type: Date, default: Date.now },
	deleted_at: { type: Date, default: null },
	deleted_by: { type: String, default: null },
});

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);
