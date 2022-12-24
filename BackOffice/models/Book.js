const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const BookSchema = new mongoose.Schema({
	title: String,
	synopsis: String,
	author: String,
	ISBN: String,
	editor: String,
	genre: String,
	launch_date: Date,
	cover: String,
	new: Number,
	worn: Number,
	number_of_pages: Number,
	price: Number,
	reviews: [
		{
			user_id: mongoose.ObjectId,
			user_name: String,
			date: Date,
			stars: Number,
			description: String,
		},
	],
	updated_at: { type: Date, default: Date.now },
	deleted_at: { type: Date, default: null },
	deleted_by: { type: String, default: null },
});

BookSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Book", BookSchema);
