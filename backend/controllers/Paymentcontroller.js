import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";

import Payment from "../models/Payment.js";

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

const normalizeUrl = (value, fallback) => {
  const raw = (value || fallback || "").trim();
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
};

const FRONTEND_URL = normalizeUrl(
  process.env.FRONTEND_URL,
  "http://localhost:5173",
);
const BACKEND_URL = normalizeUrl(
  process.env.BACKEND_URL,
  "http://localhost:5000",
);

const initiatePayment = async (req, res) => {
  try {
    const {
      amount,
      brandName,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      userId,
    } = req.body;
    if (!amount || parseFloat(amount) < 10) {
      return res.status(400).json({ error: "Amount must be at least ৳10" });
    }
    if (!customerName || !customerEmail || !customerPhone) {
      return res
        .status(400)
        .json({ error: "Customer name, email, and phone are required" });
    }
    // Generate unique transaction ID
    const transactionId = `ADFLOW-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    //this ensures we have a DB record if gateway call fails
    const payment = new Payment({
      transactionId,
      amount: parseFloat(amount),
      customerName,
      customerEmail,
      customerPhone,
      customerAddress: customerAddress || "N/A",
      brandName: brandName || "AdFlow Network",
      userId: userId || null,
    });
    await payment.save();

    //field names are exactly as SSLCommerz expects
    const data = {
      total_amount: parseFloat(amount).toFixed(2),
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${BACKEND_URL}/api/payment/success`,
      fail_url: `${BACKEND_URL}/api/payment/fail`,
      cancel_url: `${BACKEND_URL}/api/payment/cancel`,
      ipn_url: `${BACKEND_URL}/api/payment/ipn`,

      //shipping (for sslcommerz)
      shipping_method: "NO",
      product_name: brandName || "AdFlow Network",
      product_category: "Ad Payment",
      product_profile: "general",

      //customer info
      cus_name: customerName,
      cus_email: customerEmail,
      cus_add1: customerAddress || "N/A",
      cus_phone: customerPhone,
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      transactionId: payment.transactionId,

      //shipment info
      ship_name: customerName,
      ship_add1: customerAddress || "N/A",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
    };

    //call sslcommerz to create a payment session
    const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiresponse = await sslcommerz.init(data);

    if (!apiresponse?.GatewayPageURL) {
      await Payment.deleteOne({ transactionId }); //cleanup if we can't redirect user to gateway
      console.error("Failed to redirect user to SSLCommerz gateway");
      return res
        .status(502)
        .json({ error: "Failed to initialize payment gateway" });
    }
    return res.json({
      success: true,
      transactionId,
      gatewayUrl: apiresponse.GatewayPageURL,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// successful payment

const paymentSuccess = async (req, res) => {
  try {
    const payload = (req.body && Object.keys(req.body).length)
      ? req.body
      : req.query;
    const { tran_id, val_id, status } = payload;

    //missing data or invalid status
    if (!tran_id || !val_id || status !== "VALID") {
      return res.redirect(
        `${FRONTEND_URL}/payment/fail?reason=invalid_gateway_response`,
      );
    }
    const payment = await Payment.findOne({ transactionId: tran_id });
    if (!payment) {
      return res.redirect(
        `${FRONTEND_URL}/payment/fail?reason=order_not_found`,
      );
    }

    //already processed
    if (payment.status === "completed") {
      return res.redirect(`${FRONTEND_URL}/payment/success?tran_id=${tran_id}`);
    }

    //validate with sslcommerz api
    const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validationResponse = await sslcommerz.validate(val_id, tran_id);

    const isAmountCorrect =
      parseFloat(validationResponse?.amount) === payment.amount;
    const isTranIdMatch =
      String(validationResponse?.tran_id) === String(tran_id);

    if (
      validationResponse?.status === "VALID" &&
      isAmountCorrect &&
      isTranIdMatch
    ) {
      payment.markCompleted(validationResponse);
      await payment.save();
      return res.redirect(`${FRONTEND_URL}/payment/success?tran_id=${tran_id}`);
    }

    payment.markFailed(validationResponse);
    await payment.save();
    return res.redirect(
      `${FRONTEND_URL}/payment/fail?reason=validation_failed`,
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const paymentFail = async (req, res) => {
  try {
    const payload = (req.body && Object.keys(req.body).length)
      ? req.body
      : req.query;
    const { tran_id } = payload;
    if (tran_id) {
      const payment = await Payment.findOne({ transactionId: tran_id });
      if (payment && payment.status === "pending") {
        payment.markFailed(payload);
        await payment.save();
        console.log(`[Payment] FAILED: ${tran_id}`);
      }
    }
    return res.redirect(
      `${FRONTEND_URL}/payment/fail?tran_id=${tran_id || ""}`,
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const paymentCancel = async (req, res) => {
  try {
    const payload = (req.body && Object.keys(req.body).length)
      ? req.body
      : req.query;
    const { tran_id } = payload;

    if (tran_id) {
      const payment = await Payment.findOne({ transactionId: tran_id });
      if (payment && payment.status === "pending") {
        payment.markCancelled();
        await payment.save();
        console.log(`[Payment] CANCELLED: ${tran_id}`);
      }
    }
    return res.redirect(
      `${FRONTEND_URL}/payment/cancel?tran_id=${tran_id || ""}`,
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//instatnt payment notification
const paymentIPN = async (req, res) => {
  // res immediately, ssl will retry if it doesn't get a 200 response
  res.status(200).json({ success: true });
  try {
    const { tran_id, val_id, status } = req.body;
    if (!tran_id) return;

    const payment = await Payment.findOne({ transactionId: tran_id });
    if (!payment) {
      console.warn(
        `[Payment IPN] No payment record found for tran_id: ${tran_id}`,
      );
      return;
    }

    if (status === "VALID" && val_id) {
      const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const validationResponse = await sslcommerz.validate(val_id);

      if (
        validationResponse?.status === "VALID" &&
        parseFloat(validationResponse?.amount) === payment.amount &&
        String(validationResponse?.tran_id) === String(tran_id)
      ) {
        if (payment.status !== "completed") {
          payment.markCompleted(validationResponse);
          payment.ipnVerified = true;
          await payment.save();
          console.log(
            `[Payment IPN] Payment marked as COMPLETED for tran_id: ${tran_id}`,
          );
        }
      } else {
        console.warn(`[IPN] Validation mismatch for ${tran_id}`);
      }
    } else if (status === "Failed" && payment.status === "pending") {
      payment.markFailed(req.body);
      payment.ipnVerified = true;
      await payment.save();
      console.warn(`[IPN] Payment failed for tran_id: ${tran_id}`);
    }
  } catch (error) {
    console.error(
      `[Payment IPN] Error processing IPN for tran_id: ${req.body.tran_id || "N/A"}`,
      error,
    );
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { tran_id } = req.params;
    const payment = await Payment.findOne({ transactionId: tran_id });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    return res.json({
      transactionId: payment.transactionId,
      amount: payment.amount,
      status: payment.status,
      customerName: payment.customerName,
      customerEmail: payment.customerEmail,
      customerPhone: payment.customerPhone,
      brandName: payment.brandName,
      createdAt: payment.createdAt,
      paymentMethod: payment.cardType || "N/A",
      bankTransactionId: payment.bankTransactionId || "N/A",
      paidAt: payment.paidAt,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; //optional filter by status
    const skip = (page - 1) * limit;
    const filter = status ? { status } : {};

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-gatewayResponse"), //exclude large response data
      Payment.countDocuments(filter),
    ]);
    return res.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getPaymentStatus,
  getPaymentHistory,
};
