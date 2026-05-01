import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
      default: "N/A",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    //sslcommerz response fields
    validationId: {
      type: String,
      default: null,
    },
    bankTransactionId: {
      type: String,
      default: null,
    },
    cardType: {
      type: String,
      default: null,
    },
    storeAmount: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: "BDT",
    },

    //full raw sslcommerz response (audit/debugging)
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    ipnVerified: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

PaymentSchema.methods.markCompleted = function (gatewayData) {
  this.status = "completed";
  this.gatewayResponse = gatewayData;
  this.paidAt = new Date();
  this.bankTransactionId = gatewayData.bank_transaction_id || null;
  this.cardType = gatewayData.card_type || null;
  this.storeAmount = parseFloat(gatewayData.store_amount) || null;
};

PaymentSchema.methods.markFailed = function (gatewayData = {}) {
  this.status = "failed";
  this.gatewayResponse = gatewayData;
  this.failedAt = new Date();
};

PaymentSchema.methods.markCancelled = function () {
  this.status = "cancelled";
  this.cancelledAt = new Date();
}

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
