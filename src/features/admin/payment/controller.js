const Payment = require("./model");

// Get All Subscription
const getAllPayments = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const payment = new Payment(req.body);
  try {
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createOnePayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const payment = new Payment(req.body);
  try {
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateOnePayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.paymentId, req.body, { new: true });
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found." });
    }
    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteOnePayment = async (req, res, next) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.paymentId);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found." });
    }
    res.status(200).json(deletedPayment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getAllPayments,
  createOnePayment,
  updateOnePayment,
  deleteOnePayment
};
