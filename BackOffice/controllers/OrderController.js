var orderController = {};

const { generatePaymentMethod, generatePaymentIntent } = require("../services/stripe");

orderController.getItem = async (req, res) => {
  const { id } = req.params;
  const userData = await orders.findOne({ localizator: id });
  res.send({ data: userData });
};

orderController.postItem = async (req, res) => {
  try {
    const { amount, name } = req.body;
    const oderRes = await orders.create({
      name,
      amount,
    });

    res.send({ data: oderRes });
  } catch (e) {
    res.status(500);
    res.send({ error: "Something went wrong" });
  }
};

orderController.updateItem = async (req, res) => {
  try {
    let email = req.params.email;
    const { token } = req.body;

    const responseMethod = await generatePaymentMethod(token);

    console.log("Dinheiro: ", req.body.amount);
    const resPaymentIntent = await generatePaymentIntent({
      amount: req.body.amount,
      user: email,
      payment_method: responseMethod.id,
    });

    res.send({ data: resPaymentIntent });
  } catch (e) {
    console.log(e.message);
    res.status(500);
    res.send({ error: "Something went wrong" });
  }
};

module.exports = orderController;
