const fs = require("fs");
const request = require("request");
var Book = require("../models/Book");

var bookController = {};

bookController.search = function (req, res, next) {
	let searchContent = req.query.searchContent || "";
	let page = req.query.page || 1;
	let perPage = req.query.perPage || 5;
	let minPrice = req.query.minPrice || 0;
	let maxPrice = req.query.maxPrice || 300;
	let priceSort = req.query.priceSort || "asc";

	var query = {
		$or: [
			{ title: { $regex: searchContent, $options: "i" } },
			{ author: { $regex: searchContent, $options: "i" } },
			{ ISBN: { $regex: searchContent, $options: "i" } },
		],
		price: { $gte: minPrice, $lte: maxPrice },
		deleted_at: null,
	};
	const myCustomLabels = {
		docs: "books",
	};

	const options = {
		page: page,
		limit: perPage,
		sort: { price: 1 },
		customLabels: myCustomLabels,
	};

	if (priceSort == "desc") options.sort.price = -1;

	Book.paginate(query, options, function (err, results) {
		if (err) {
			console.log("Error", err);
			next(err);
		} else {
			res.json(results);
		}
	});
};

// Show all employees
bookController.showAll = function (req, res, next) {
	Book.find({ deleted_at: null }).exec(function (err, results) {
		if (err) {
			console.log("Error", err);
			next(err);
		} else {
			res.json(results);
		}
	});
};

// Show employee by id
bookController.show = function (req, res, next) {
	Book.findOne({ _id: req.params.id, deleted_at: null }).exec(function (err, book) {
		if (err) {
			console.log("Error", err);
			next(err);
		} else {
			res.json(book);
		}
	});
};

function downloadImage(uri, filename, callback) {
	request.head(uri, function (err, res, body) {
		console.log("content-type:", res.headers["content-type"]);
		console.log("content-length:", res.headers["content-length"]);

		request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
	});
}

// Save new employee
bookController.create = function (req, res, next) {
	console.table(req.errors);
	if (req?.body?.apicover) {
		const downloadURL = req.body.apicover;
		const extension = downloadURL.substring(downloadURL.length - 3);
		const downloadedImageName = Date.now() + "-" + req.body.ISBN + "." + extension;
		const filePath = "./public/images/uploads/" + downloadedImageName;
		downloadImage(downloadURL, filePath, function () {
			console.log("done");
		});

		req.body.cover = downloadedImageName;
		delete req.body.apicover;
	} else {
		if (req?.file?.filename) {
			req.body.cover = req.file.filename;
		} else {
			req.body.cover = "";
		}
	}

	const createdBook = new Book(req.body);
	createdBook.save(function (err) {
		if (err) {
			console.log(err);
			next(err);
		} else {
			res.json(createdBook);
		}
	});
};

bookController.edit = function (req, res, next) {
	const book = {
		title: req.body.title,
		author: req.body.author,
		ISBN: req.body.ISBN,
		editor: req.body.editor,
		genre: req.body.genre,
		new: req.body.new,
		worn: req.body.worn,
		cover: req?.file?.filename,
		number_of_pages: req.body.number_of_pages,
		launch_date: req.body.launch_date,
		price: req.body.price,
		synopsis: req.body.synopsis,
		updated_at: new Date(),
	};

	if (!req?.file?.filename) {
		delete book.cover;
	}

	Book.findByIdAndUpdate(
		req.params.id,
		{
			$set: book,
		},
		{ new: true },
		function (err, editedBook) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.json(editedBook);
			}
		}
	);
};

bookController.delete = function (req, res, next) {
	Book.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				deleted_at: new Date(),
				deleted_by: req.params.userid,
			},
		},
		{ new: true },
		function (err, deletedBook) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.json(deletedBook);
			}
		}
	);
};

bookController.registerReview = function (req, res, next) {
	Book.findByIdAndUpdate(
		req.params.id,
		{
			$push: {
				reviews: req.body,
			},
		},
		{ new: true },
		function (err, updatedBook) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.json(updatedBook);
			}
		}
	);
};

module.exports = bookController;
