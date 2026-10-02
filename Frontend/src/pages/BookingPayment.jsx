import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import usePaymentStore from "../store/payment.store";

export default function BookingPayment() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const { loading, error, createOrder, verify, clearError } = usePaymentStore();

  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // --------------------------------------------------
  // Load Razorpay script
  // --------------------------------------------------
  useEffect(() => {
    if (window.Razorpay) {
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("Razorpay SDK loaded");
    };

    script.onerror = () => {
      setPaymentError(
        "Failed to load Razorpay. Please check your internet connection.",
      );
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // --------------------------------------------------
  // Clear previous errors
  // --------------------------------------------------
  useEffect(() => {
    clearError();
    setPaymentError("");
  }, [appointmentId, clearError]);

  // --------------------------------------------------
  // Start payment
  // --------------------------------------------------
  const handlePayment = async () => {
    try {
      setPaymentError("");

      if (!appointmentId) {
        setPaymentError("Invalid appointment.");
        return;
      }

      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        setPaymentError("Razorpay key is not configured.");
        return;
      }

      if (!window.Razorpay) {
        setPaymentError("Razorpay is still loading. Please try again.");
        return;
      }

      setProcessing(true);

      // ------------------------------------------------
      // 1. Create Razorpay order from backend
      // ------------------------------------------------
      const data = await createOrder(appointmentId);

      if (!data?.success || !data?.order) {
        throw new Error(data?.message || "Failed to create payment order.");
      }

      const { id, amount, currency } = data.order;

      // ------------------------------------------------
      // 2. Razorpay checkout configuration
      // ------------------------------------------------
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount,
        currency,

        name: "Lumière",
        description: "Salon Appointment Payment",

        order_id: id,

        theme: {
          color: "#d97706",
        },

        handler: async function (response) {
          try {
            setProcessing(true);
            setPaymentError("");

            // ------------------------------------------
            // 3. Verify payment on backend
            // ------------------------------------------
            const verifyData = await verify({
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

              appointmentId,
            });

            if (!verifyData?.success) {
              throw new Error(
                verifyData?.message || "Payment verification failed.",
              );
            }

            // ------------------------------------------
            // 4. Payment successful
            // ------------------------------------------
            navigate("/booking/success", {
              replace: true,
              state: {
                appointmentId,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              },
            });
          } catch (error) {
            console.error("Payment verification error:", error);

            setPaymentError(
              error?.response?.data?.message ||
                error?.message ||
                "Payment verification failed. Please contact support.",
            );
          } finally {
            setProcessing(false);
          }
        },

        modal: {
          ondismiss: function () {
            setProcessing(false);
            setPaymentError("Payment was cancelled. You can try again.");
          },
        },

        notes: {
          appointmentId: String(appointmentId),
        },

        prefill: {
          // Keep this empty unless your appointment/user
          // API already provides customer details here.
        },

        retry: {
          enabled: true,
        },

        remember_customer: true,
      };

      // ------------------------------------------------
      // 5. Open Razorpay
      // ------------------------------------------------
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response);

        setProcessing(false);

        setPaymentError(
          response?.error?.description || "Payment failed. Please try again.",
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("Create order error:", error);

      setPaymentError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start payment.",
      );

      setProcessing(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-stone-100 px-6 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-amber-600">
              Secure Payment
            </p>

            <h1 className="mt-3 text-4xl font-bold text-stone-900">
              Complete your booking
            </h1>

            <p className="mt-3 text-stone-500">
              Complete the payment securely through Razorpay.
            </p>
          </div>

          {/* Payment Card */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            {/* Top */}
            <div className="border-b border-stone-200 bg-stone-900 px-6 py-7 text-white">
              <p className="text-sm text-stone-300">Appointment</p>

              <div className="mt-2 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">Lumière Salon</h2>

                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-stone-950">
                  Secure
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="rounded-2xl bg-stone-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-stone-500">Appointment ID</p>

                    <p className="mt-1 font-semibold text-stone-900">
                      #{appointmentId}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-stone-500">Payment</p>

                    <p className="mt-1 font-semibold text-amber-600">Online</p>
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <span>🔒</span>
                  </div>

                  <div>
                    <p className="font-semibold text-stone-900">
                      Secure Payment
                    </p>

                    <p className="text-sm text-stone-500">
                      Your payment is processed securely by Razorpay.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                    <span>✓</span>
                  </div>

                  <div>
                    <p className="font-semibold text-stone-900">
                      Server Verified
                    </p>

                    <p className="text-sm text-stone-500">
                      Your payment will be verified before the appointment is
                      confirmed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error */}
              {(paymentError || error) && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-600">
                    {paymentError || error}
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={processing || loading}
                className="mt-8 w-full rounded-xl bg-stone-900 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing || loading
                  ? "Processing Payment..."
                  : "Pay Securely with Razorpay"}
              </button>

              {/* Footer */}
              <div className="mt-5 text-center">
                <p className="text-xs text-stone-400">
                  You will be redirected to Razorpay's secure checkout window.
                </p>
              </div>
            </div>
          </div>

          {/* Security badges */}
          <div className="mt-6 flex justify-center gap-6 text-xs text-stone-400">
            <span>🔒 Secure</span>
            <span>💳 Razorpay</span>
            <span>✓ Verified</span>
          </div>
        </div>
      </div>
    </>
  );
}
