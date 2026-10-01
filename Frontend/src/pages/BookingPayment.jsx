import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import usePaymentStore from "../store/payment.store";

export default function BookingPayment() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const {
    createOrder,
    verify,
    loading,
    error: paymentError,
  } = usePaymentStore();

  const [error, setError] = useState("");
  const [paymentStarted, setPaymentStarted] = useState(false);

  // Check appointment ID
  useEffect(() => {
    if (!appointmentId) {
      navigate("/booking", { replace: true });
    }
  }, [appointmentId, navigate]);

  // Start Razorpay payment
  const handlePayment = async () => {
    try {
      setError("");
      setPaymentStarted(true);

      if (!window.Razorpay) {
        setError(
          "Razorpay Checkout failed to load. Please refresh the page and try again.",
        );
        setPaymentStarted(false);
        return;
      }

      // Create Razorpay order
      const orderData = await createOrder(appointmentId);

      const order = orderData?.order;

      if (!order?.id) {
        throw new Error("Payment order was not created correctly.");
      }

      // Razorpay Checkout

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Lumiere Salon",
        description: "Salon Appointment Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            setError("");

            /*
              Razorpay returns:

              razorpay_payment_id
              razorpay_order_id
              razorpay_signature
            */

            const verificationData = {
              appointmentId: Number(appointmentId),
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            await verify(verificationData);

            // ------------------------------------------
            // Payment successful
            // ------------------------------------------
            navigate("/booking/success", {
              replace: true,
              state: {
                appointmentId: Number(appointmentId),
              },
            });
          } catch (error) {
            setError(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed.",
            );

            setPaymentStarted(false);
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#292524",
        },

        modal: {
          ondismiss: function () {
            setPaymentStarted(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay Payment Failed:", response.error);
        setError(
          response.error?.description || "Payment failed. Please try again.",
        );
        setPaymentStarted(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment.",
      );

      setPaymentStarted(false);
    }
  };

  if (!appointmentId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-12">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-amber-600">
            Secure Payment
          </p>

          <h1 className="mt-2 text-4xl font-bold text-stone-900">
            Complete your payment
          </h1>

          <p className="mt-3 text-stone-500">
            Your appointment has been created. Complete the payment to confirm
            your booking.
          </p>
        </div>

        {/* Appointment */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500">Appointment ID</span>

            <span className="font-semibold text-stone-900">
              #{appointmentId}
            </span>
          </div>

          <div className="mt-5 rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">Payment</p>

            <p className="mt-1 text-lg font-semibold text-stone-900">
              Salon Appointment
            </p>

            <p className="mt-1 text-sm text-stone-500">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>

        {/* Error */}
        {(error || paymentError) && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error || paymentError}
          </div>
        )}

        {/* Payment Button */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={loading || paymentStarted}
          className="mt-6 w-full rounded-xl bg-stone-900 px-6 py-4 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading || paymentStarted
            ? "Opening Payment..."
            : "Pay Securely with Razorpay"}
        </button>

        {/* Security Information */}
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex gap-3">
            <div className="mt-0.5">🔒</div>

            <div>
              <p className="text-sm font-semibold text-stone-800">
                Secure Payment
              </p>

              <p className="mt-1 text-xs leading-5 text-stone-500">
                Your payment is processed securely through Razorpay. We never
                store your card or UPI credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <button
          type="button"
          disabled={loading || paymentStarted}
          onClick={() => navigate("/booking/summary")}
          className="mt-5 w-full rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back to Summary
        </button>
      </div>
    </div>
  );
}
