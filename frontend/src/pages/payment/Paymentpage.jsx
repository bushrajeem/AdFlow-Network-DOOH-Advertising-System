import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiatePayment } from '../../services/PaymentApi';


function Paymentpage() {
    const navigate = useNavigate();

    // logged in user info from the local storage
    const storedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return {};
        }
    })();
    const [form, setForm] = useState(
        {
            amount: "",
            BrandName: "",
            productDescription: "",
            customerName: storedUser.name || "",
            customerEmail: storedUser.email || "",
            customerPhone: storedUser.phone || "",
            customerAddress: "",
        }
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError("");
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const amount = parseFloat(form.amount);
        if (!amount || amount < 10) {
            return setError("Minimum payment amount is ৳10.");
        }
        if (!form.customerName.trim()) return setError("Name is required.");
        if (!form.customerEmail.trim()) return setError("Email is required.");
        if (!form.customerPhone.trim()) return setError("Phone is required.");

        setLoading(true);
        try {
            const { gatewayUrl } = await initiatePayment({
                amount,
                brandName: form.BrandName,
                productDescription: form.productDescription,
                customerName: form.customerName,
                customerEmail: form.customerEmail,
                customerPhone: form.customerPhone,
                customerAddress: form.customerAddress,
                userId: storedUser._id || storedUser.id || null,
            });
            // ── Hard redirect to SSLCommerz gateway ─────────────
            // User picks their payment method (bKash / Nagad / card etc.) there.
            // SSLCommerz will POST back to your backend success/fail/cancel URLs.
            window.location.href = gatewayUrl;

            console.log(e);

        } catch (err) {
            setError(err.message || "Payment initiation failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className='h-screen'>
            <img
                className='w-full h-full relative object-cover'
                src="/payment_pic.webp" alt="" />

            <div className='absolute h-155 top-1 right-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 px-15 py-10 text-center overflow-hidden'>
                <h1 className='text-2xl font-bold text-black'>AdFlow Checkout</h1>
                <p className='text-gray-600 mt-2 text-[14px]'>Complete your purchase with our secure payment system.</p>

                {/* forms */}
                <form onSubmit={handleSubmit} className='px-6 py-6 flex flex-col gap-4'>
                    {/* Amount + Product */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Amount (BDT) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                    ৳
                                </span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="10"
                                    step="0.01"
                                    required
                                    className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Brand Name</label>
                            <input
                                type="text"
                                name="BrandName"
                                value={form.BrandName}
                                onChange={handleChange}
                                placeholder="e.g. AdFlow"
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1" />
                    {/* Customer Info */}
                    <p className="text-sm font-semibold text-gray-700 -mb-1">Customer Information</p>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={form.customerName}
                                onChange={handleChange}
                                placeholder="Your full name"
                                required
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={form.customerEmail}
                                onChange={handleChange}
                                placeholder="you@email.com"
                                required
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={form.customerPhone}
                                onChange={handleChange}
                                placeholder="01XXXXXXXXX"
                                required
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Address <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="customerAddress"
                                value={form.customerAddress}
                                onChange={handleChange}
                                placeholder="Your address"
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    {/* Amount Summary */}
                    {form.amount && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 flex items-center justify-between">
                            <span className="text-sm text-blue-700 font-medium">Total to pay</span>
                            <span className="text-lg font-bold text-blue-900">
                                ৳ {parseFloat(form.amount || 0).toFixed(2)}
                            </span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: loading ? "#6b7280" : "#002B6B" }}
                        className="w-full mt-2 text-white text-sm font-semibold py-3.5 rounded-xl tracking-wide transition-all hover:opacity-90 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Redirecting to Payment Gateway...
                            </>
                        ) : (
                            <>🔒 Proceed to Pay ৳ {parseFloat(form.amount || 0).toFixed(2)}</>
                        )}
                    </button>

                    {/* Trust badge */}
                    <p className="text-center text-xs text-gray-400 mt-1">🔐 Powered by SSLCommerz</p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Cancel and go back
                    </button>
                </form>
            </div>



        </div>

    )
}

export default Paymentpage


