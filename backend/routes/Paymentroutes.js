import express from "express";

import {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getPaymentStatus,
  getPaymentHistory,
} from "../controllers/Paymentcontroller.js";

const router = express.Router();

// POST /api/payment/initiate
router.post("/initiate", initiatePayment);

// POST /api/payment/success
router.post("/success", paymentSuccess);

// POST /api/payment/fail
router.post("/fail", paymentFail);

// POST /api/payment/cancel
router.post("/cancel", paymentCancel);

// POST /api/payment/ipn
router.post("/ipn", paymentIPN);

// GET /api/payment/status/:tran_id
router.get("/status/:tran_id", getPaymentStatus);

// GET /api/payment/history
router.get("/history", getPaymentHistory);

export default router;
