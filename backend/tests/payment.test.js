/**
 * tests/payment.test.js
 *
 * AdFlow Network — Payment System Unit Tests
 * Tool: Jest (no real DB or SSLCommerz calls — everything is mocked)
 *
 * Test Cases:
 *  TC-01  initiatePayment → rejects amount below ৳10
 *  TC-02  initiatePayment → rejects missing required customer fields
 *  TC-03  initiatePayment → success returns tran_id + gatewayUrl
 *  TC-04  initiatePayment → SSLCommerz gateway failure returns 502
 *  TC-05  paymentSuccess  → redirects to fail when status !== VALID
 *  TC-06  paymentSuccess  → redirects to fail when order not found in DB
 *  TC-07  paymentSuccess  → idempotent: already-completed payment redirects to success
 *  TC-08  paymentSuccess  → validation mismatch marks payment failed
 *  TC-09  paymentSuccess  → valid payment marks completed and redirects success
 *  TC-10  paymentFail     → marks pending payment as failed in DB
 *  TC-11  paymentCancel   → marks pending payment as cancelled in DB
 *  TC-12  paymentIPN      → responds 200 immediately (before async work)
 *  TC-13  getPaymentStatus → returns 404 for unknown tran_id
 *  TC-14  getPaymentStatus → returns correct payment data for known tran_id
 *  TC-15  getPaymentHistory → returns paginated list with totals
 */

// ─── Mock external dependencies BEFORE imports ─────────────────
// This stops Jest from touching real MongoDB or SSLCommerz network calls.
import { jest } from "@jest/globals";

// Mock the Payment mongoose model
jest.unstable_mockModule("../models/Payment.js", () => ({
  default: jest.fn(),
}));

// Mock the sslcommerz-lts package
jest.unstable_mockModule("sslcommerz-lts", () => ({
  default: jest.fn(),
}));

// Mock uuid so transaction IDs are predictable in tests
jest.unstable_mockModule("uuid", () => ({
  v4: () => "aaaabbbb-cccc-dddd-eeee-ffffgggghhhh",
}));

// ─── Imports ───────────────────────────────────────────────────
const { default: Payment } = await import("../models/Payment.js");
const { default: SSLCommerzPayment } = await import("sslcommerz-lts");

const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getPaymentStatus,
  getPaymentHistory,
} = await import("../controllers/Paymentcontroller.js");

// ─── Helpers ───────────────────────────────────────────────────

/**
 * Build a mock Express req object.
 * @param {object} body   - req.body
 * @param {object} params - req.params
 * @param {object} query  - req.query
 */
function mockReq({ body = {}, params = {}, query = {} } = {}) {
  return { body, params, query };
}

/**
 * Build a mock Express res object that captures what the controller does.
 * Supports: res.status(n).json({}), res.json({}), res.redirect(url)
 */
function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.status = jest.fn((code) => { res.statusCode = code; return res; });
  res.json     = jest.fn((data) => { res._json = data; return res; });
  res.redirect = jest.fn((url)  => { res._redirect = url; return res; });
  return res;
}

/**
 * Reusable valid customer payload — all required fields present.
 */
const VALID_BODY = {
  amount:        500,
  brandName:     "TestBrand",
  customerName:  "Rahim Uddin",
  customerEmail: "rahim@example.com",
  customerPhone: "01711111111",
  customerAddress: "Dhaka",
};

// ─── Mock Payment instance factory ────────────────────────────
// Returns a plain object that looks like a saved Payment document.
function makeMockPayment(overrides = {}) {
  return {
    transactionId: "ADFLOW-MOCK-12345",
    amount:       500,
    status:       "pending",
    customerName: "Rahim Uddin",
    ipnVerified:  false,
    save:         jest.fn().mockResolvedValue(true),
    markCompleted: jest.fn(function (data) { this.status = "completed"; this.paidAt = new Date(); }),
    markFailed:    jest.fn(function ()     { this.status = "failed";    this.failedAt = new Date(); }),
    markCancelled: jest.fn(function ()     { this.status = "cancelled"; this.cancelledAt = new Date(); }),
    ...overrides,
  };
}

// ─── Reset all mocks before each test ─────────────────────────
beforeEach(() => {
  jest.clearAllMocks();

  // Default: Payment constructor + save work fine
  Payment.mockImplementation(() => makeMockPayment());
  Payment.findOne       = jest.fn();
  Payment.deleteOne     = jest.fn().mockResolvedValue({});
  Payment.find          = jest.fn();
  Payment.countDocuments = jest.fn();

  // Default SSLCommerz: init returns a valid gateway URL
  SSLCommerzPayment.mockImplementation(() => ({
    init: jest.fn().mockResolvedValue({
      GatewayPageURL: "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=pay&SESSIONKEY=abc123",
    }),
    validate: jest.fn().mockResolvedValue({
      status:       "VALID",
      tran_id:      "ADFLOW-MOCK-12345",
      amount:       "500.00",
      store_amount: "490.00",
      val_id:       "VAL-XYZ-789",
      bank_tran_id: "BANK-TXN-001",
      card_type:    "bKash",
    }),
  }));
});

// ══════════════════════════════════════════════════════════════
//  GROUP 1 — initiatePayment
// ══════════════════════════════════════════════════════════════
describe("TC-01 to TC-04 | POST /api/payment/initiate", () => {

  // ── TC-01 ─────────────────────────────────────────────────
  test("TC-01 | Rejects amount below minimum ৳10", async () => {
    const req = mockReq({ body: { ...VALID_BODY, amount: 5 } });
    const res = mockRes();

    await initiatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res._json).toMatchObject({
      error: "Amount must be at least ৳10",
    });
  });

  // ── TC-02 ─────────────────────────────────────────────────
  test("TC-02 | Rejects request when required customer fields are missing", async () => {
    const req = mockReq({
      body: { amount: 500 }, // name / email / phone all missing
    });
    const res = mockRes();

    await initiatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res._json).toMatchObject({ error: expect.stringContaining("required") });
  });

  // ── TC-03 ─────────────────────────────────────────────────
  test("TC-03 | Successful initiation returns tran_id and gatewayUrl", async () => {
    const req = mockReq({ body: VALID_BODY });
    const res = mockRes();

    await initiatePayment(req, res);

    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res._json).toMatchObject({
      success: true,
      transactionId: expect.stringContaining("ADFLOW-"),
      gatewayUrl: expect.stringContaining("sslcommerz.com"),
    });
  });

  // ── TC-04 ─────────────────────────────────────────────────
  test("TC-04 | Returns 502 when SSLCommerz does not return a GatewayPageURL", async () => {
    // Override SSLCommerz to simulate gateway error
    SSLCommerzPayment.mockImplementation(() => ({
      init: jest.fn().mockResolvedValue({
        status:       "FAILED",
        failedreason: "Invalid store credentials",
        // GatewayPageURL is absent
      }),
    }));

    const req = mockReq({ body: VALID_BODY });
    const res = mockRes();

    await initiatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res._json).toMatchObject({ error: expect.any(String) });
    // The incomplete pending record must be cleaned up
    expect(Payment.deleteOne).toHaveBeenCalled();
  });
});

// ══════════════════════════════════════════════════════════════
//  GROUP 2 — paymentSuccess
// ══════════════════════════════════════════════════════════════
describe("TC-05 to TC-09 | POST /api/payment/success", () => {

  // ── TC-05 ─────────────────────────────────────────────────
  test("TC-05 | Redirects to /payment/fail when gateway status is not VALID", async () => {
    const req = mockReq({
      body: { tran_id: "ADFLOW-MOCK-12345", val_id: "VAL-001", status: "FAILED" },
    });
    const res = mockRes();

    await paymentSuccess(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining("/payment/fail")
    );
  });

  // ── TC-06 ─────────────────────────────────────────────────
  test("TC-06 | Redirects to /payment/fail when order is not found in DB", async () => {
    Payment.findOne.mockResolvedValue(null); // simulate missing order

    const req = mockReq({
      body: { tran_id: "UNKNOWN-TXN", val_id: "VAL-001", status: "VALID" },
    });
    const res = mockRes();

    await paymentSuccess(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining("order_not_found")
    );
  });

  // ── TC-07 ─────────────────────────────────────────────────
  test("TC-07 | Already-completed payment is handled idempotently (no double-process)", async () => {
    const alreadyDone = makeMockPayment({ status: "completed" });
    Payment.findOne.mockResolvedValue(alreadyDone);

    const req = mockReq({
      body: { tran_id: "ADFLOW-MOCK-12345", val_id: "VAL-001", status: "VALID" },
    });
    const res = mockRes();

    await paymentSuccess(req, res);

    // Must redirect to success, not call markCompleted again
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining("/payment/success")
    );
    expect(alreadyDone.markCompleted).not.toHaveBeenCalled();
  });

  // ── TC-08 ─────────────────────────────────────────────────
  test("TC-08 | Validation mismatch marks payment failed and redirects to /payment/fail", async () => {
    const pendingPayment = makeMockPayment({ amount: 500 });
    Payment.findOne.mockResolvedValue(pendingPayment);

    // SSLCommerz returns a different amount — tampered request
    SSLCommerzPayment.mockImplementation(() => ({
      validate: jest.fn().mockResolvedValue({
        status:  "VALID",
        tran_id: "ADFLOW-MOCK-12345",
        amount:  "1.00", // way less than ৳500 — mismatch!
      }),
    }));

    const req = mockReq({
      body: { tran_id: "ADFLOW-MOCK-12345", val_id: "VAL-BAD", status: "VALID" },
    });
    const res = mockRes();

    await paymentSuccess(req, res);

    expect(pendingPayment.markFailed).toHaveBeenCalled();
    expect(pendingPayment.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining("validation_failed")
    );
  });

  // ── TC-09 ─────────────────────────────────────────────────
  test("TC-09 | Valid payment marks status as completed and redirects to /payment/success", async () => {
    const pendingPayment = makeMockPayment({ amount: 500 });
    Payment.findOne.mockResolvedValue(pendingPayment);

    const req = mockReq({
      body: { tran_id: "ADFLOW-MOCK-12345", val_id: "VAL-XYZ-789", status: "VALID" },
    });
    const res = mockRes();

    await paymentSuccess(req, res);

    expect(pendingPayment.markCompleted).toHaveBeenCalled();
    expect(pendingPayment.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining("/payment/success")
    );
  });
});

// ══════════════════════════════════════════════════════════════
//  GROUP 3 — paymentFail
// ══════════════════════════════════════════════════════════════
describe("TC-10 | POST /api/payment/fail", () => {

  test("TC-10 | Marks a pending payment as failed and redirects to /payment/fail", async () => {
    const pendingPayment = makeMockPayment({ status: "pending" });
    Payment.findOne.mockResolvedValue(pendingPayment);

    const req = mockReq({ body: { tran_id: "ADFLOW-MOCK-12345" } });
    const res = mockRes();

    await paymentFail(req, res);

    expect(pendingPayment.markFailed).toHaveBeenCalled();
    expect(pendingPayment.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining("/payment/fail")
    );
  });
});

// ══════════════════════════════════════════════════════════════
//  GROUP 4 — paymentCancel
// ══════════════════════════════════════════════════════════════
describe("TC-11 | POST /api/payment/cancel", () => {

  test("TC-11 | Marks a pending payment as cancelled and redirects to /payment/cancel", async () => {
    const pendingPayment = makeMockPayment({ status: "pending" });
    Payment.findOne.mockResolvedValue(pendingPayment);

    const req = mockReq({ body: { tran_id: "ADFLOW-MOCK-12345" } });
    const res = mockRes();

    await paymentCancel(req, res);

    expect(pendingPayment.markCancelled).toHaveBeenCalled();
    expect(pendingPayment.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining("/payment/cancel")
    );
  });
});

// ══════════════════════════════════════════════════════════════
//  GROUP 5 — paymentIPN
// ══════════════════════════════════════════════════════════════
describe("TC-12 | POST /api/payment/ipn", () => {

  test("TC-12 | Responds HTTP 200 immediately before any async processing", async () => {
    // IPN must ACK right away — SSLCommerz will retry if we're slow
    Payment.findOne.mockResolvedValue(null); // order not found = still must respond 200

    const req = mockReq({ body: { tran_id: "ADFLOW-MOCK-12345", status: "VALID", val_id: "V1" } });
    const res = mockRes();

    await paymentIPN(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res._json).toMatchObject({ success: true });
  });
});

// ══════════════════════════════════════════════════════════════
//  GROUP 6 — getPaymentStatus
// ══════════════════════════════════════════════════════════════
describe("TC-13 to TC-14 | GET /api/payment/status/:tran_id", () => {

  // ── TC-13 ─────────────────────────────────────────────────
  test("TC-13 | Returns 404 when tran_id does not exist in DB", async () => {
    // Controller uses: Payment.findOne({ tran_id }, "field1 field2 ...")
    // — two-argument form, resolves directly to null when not found
    Payment.findOne.mockResolvedValue(null);

    const req = mockReq({ params: { tran_id: "DOES-NOT-EXIST" } });
    const res = mockRes();

    await getPaymentStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res._json).toMatchObject({ error: "Payment not found" });
  });

  // ── TC-14 ─────────────────────────────────────────────────
  test("TC-14 | Returns correct payment data for a known tran_id", async () => {
    const mockPaymentDoc = {
      transactionId: "ADFLOW-MOCK-12345",
      status:       "completed",
      amount:       500,
      customerName: "Rahim Uddin",
      brandName:    "TestBrand",
      cardType:     "bKash",
      bankTransactionId: "BANK-TXN-001",
      paidAt:       new Date("2025-01-01T10:00:00Z"),
      createdAt:    new Date("2025-01-01T09:55:00Z"),
    };

    // Controller uses findOne(filter, projection) — resolves directly to doc
    Payment.findOne.mockResolvedValue(mockPaymentDoc);

    const req = mockReq({ params: { tran_id: "ADFLOW-MOCK-12345" } });
    const res = mockRes();

    await getPaymentStatus(req, res);

    expect(res._json).toMatchObject({
      transactionId: "ADFLOW-MOCK-12345",
      status:        "completed",
      amount:        500,
      paymentMethod: "bKash",
      bankTransactionId: "BANK-TXN-001",
    });
  });
});

// ══════════════════════════════════════════════════════════════
//  GROUP 7 — getPaymentHistory
// ══════════════════════════════════════════════════════════════
describe("TC-15 | GET /api/payment/history", () => {

  test("TC-15 | Returns paginated payment list with correct total and page info", async () => {
    const mockList = [
      { tran_id: "ADFLOW-001", status: "completed", amount: 500 },
      { tran_id: "ADFLOW-002", status: "pending",   amount: 200 },
      { tran_id: "ADFLOW-003", status: "failed",    amount: 100 },
    ];

    // Chain: Payment.find(...).sort(...).skip(...).limit(...).select(...)
    Payment.find.mockReturnValue({
      sort:   jest.fn().mockReturnThis(),
      skip:   jest.fn().mockReturnThis(),
      limit:  jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(mockList),
    });
    Payment.countDocuments.mockResolvedValue(3);

    const req = mockReq({ query: { page: "1", limit: "20" } });
    const res = mockRes();

    await getPaymentHistory(req, res);

    expect(res._json).toMatchObject({
      payments:   mockList,
      total:      3,
      page:       1,
      totalPages: 1,
    });
  });
});