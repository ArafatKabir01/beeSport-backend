const express = require("express");
const validatePayment = require("./validations");
const { getAllPayments, createOnePayment, updateOnePayment, deleteOnePayment } = require("./controller");
const router = express.Router();

router.get("/payments", validatePayment, getAllPayments);

router.post("/payments", validatePayment, createOnePayment);

router.put("/payments/:paymentId", validatePayment, updateOnePayment);

router.delete("/payments/:paymentId", deleteOnePayment);
