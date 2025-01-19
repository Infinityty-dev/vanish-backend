const express = require('express');
const { paymentGateway } = require('../controllers/paymentGateway');
const router = express.Router();




router.post("/makePayment", paymentGateway)