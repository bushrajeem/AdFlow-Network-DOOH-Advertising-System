import { useSearchParams, Link } from "react-router-dom";

function PaymentCancel() {
  const [params] = useSearchParams();
  const tranId = params.get("tran_id") || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
        <div className="text-3xl">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">Payment cancelled</h1>
        <p className="text-gray-600 mt-2">You cancelled the payment process.</p>
        {tranId && (
          <p className="text-sm text-gray-500 mt-3">Transaction ID: {tranId}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/payment"
            className="w-full inline-flex items-center justify-center rounded-xl bg-blue-700 text-white text-sm font-semibold py-3"
          >
            Try again
          </Link>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold py-3"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
