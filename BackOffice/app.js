const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const dotenv = require("dotenv").config();

mongoose.Promise = global.Promise;

// If using MongoAtlas uncomment the next line and complete the link with your clustercc

// mongoose.connect('mongodb+srv://khalilo:khalilo123@cluster0.f25mvmm.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true} )
mongoose
	.connect(process.env.DB_URI_ATLAS || process.env.DB_URI, { useNewUrlParser: true })
	.then(() => console.log("connection successful"))
	.catch((err) => console.error(err)); 

const indexRouter = require("./routes/index");
const employeesRouter = require("./routes/employees");
const usersRouter = require("./routes/users");
const usersRestRouter = require("./routes/usersRest");
const booksRestRouter = require("./routes/booksRest");
const loyaltyConditionsRestRouter = require("./routes/loyaltyConditionsRest");
const booksRouter = require("./routes/books");
const loyaltyConditionsRouter = require("./routes/loyaltyConditions");
const authRouter = require("./routes/auth");
const authRestRouter = require("./routes/authRest");
const orderRouter = require("./routes/order");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("layout", "./layouts/masterLayout");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.use(expressLayouts);
app.use("/flowbite/dist", express.static(__dirname + "/node_modules/flowbite/dist"));
app.use(
	"/flowbite/dist/datepicker",
	express.static(__dirname + "/node_modules/@themesberg/flowbite/dist")
);
app.use("/", indexRouter);
app.use("/employees", employeesRouter);
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/loyaltyConditions", loyaltyConditionsRouter);
app.use("/auth", authRouter);
app.use("/api/v1/auth", authRestRouter);
app.use("/api/v1/users", usersRestRouter);
app.use("/api/v1/books", booksRestRouter);
app.use("/api/v1/loyaltyConditions", loyaltyConditionsRestRouter);
app.use("/api/v1/orders", orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
