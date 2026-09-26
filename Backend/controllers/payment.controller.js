const Razorpay = require("razorpay");
const crypto = require("crypto");

const { Appointment, Payment, Service } = require("../models");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// CREATE PAYMENT ORDER
// ==========================================

const createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: Service,
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Make sure the appointment belongs to logged-in user
    if (appointment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Already paid
    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already paid",
      });
    }

    if (!appointment.Service) {
      return res.status(404).json({
        success: false,
        message: "Service not found for this appointment",
      });
    }

    const amount = Number(appointment.Service.price);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid service price",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `appointment_${appointment.id}`,
    });

    return res.status(200).json({
      success: true,
      order,
      amount,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// ==========================================
// VERIFY PAYMENT
// ==========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !appointmentId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    // ------------------------------------------
    // Verify Razorpay signature
    // ------------------------------------------

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ------------------------------------------
    // Find appointment
    // ------------------------------------------

    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: Service,
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // ------------------------------------------
    // Check ownership
    // ------------------------------------------

    if (appointment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ------------------------------------------
    // Prevent duplicate payment
    // ------------------------------------------

    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already paid",
      });
    }

    const existingPayment = await Payment.findOne({
      where: {
        appointmentId,
        status: "paid",
      },
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this appointment",
      });
    }

    // ------------------------------------------
    // Get service amount
    // ------------------------------------------

    if (!appointment.Service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const amount = Number(appointment.Service.price);

    // ------------------------------------------
    // Create payment record
    // ------------------------------------------

    await Payment.create({
      appointmentId,
      userId: req.user.id,
      amount,
      gateway: "razorpay",
      transactionId: razorpay_payment_id,
      status: "paid",
      paidAt: new Date(),
    });

    // ------------------------------------------
    // Confirm appointment
    // ------------------------------------------

    await appointment.update({
      paymentStatus: "paid",
      status: "confirmed",
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
