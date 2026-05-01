const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export async function initiatePayment(payload) {
  const res = await fetch(`${API_BASE}/payment/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Payment initiation failed.");
  }
  return data;
}

export async function getPaymentStatus(transactionId) {
  const res = await fetch(`${API_BASE}/payment/status/${transactionId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to get payment status.");
  }
  return data;
}

export async function getPaymentHistory({ page = 1, limit = 20, status } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append("status", status);
  const res = await fetch(`${API_BASE}/payment/history?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch payment history.");
  }
  return data;
}

export async function verifyPayment(payload) {
  const res = await fetch(`${API_BASE}/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Payment verification failed.");
  }
  return data;
}
