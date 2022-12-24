const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController.js");

router.post("/", orderController.postItem);

router.get("/:id", orderController.getItem);

router.patch("/:email", orderController.updateItem);

module.exports = router;
