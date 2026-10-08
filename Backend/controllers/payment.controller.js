const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Appointment, Payment, Service, sequelize } = require("../models/Index");

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
          as: "service",
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Authorization check
    if (String(appointment.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Already paid check
    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already paid",
      });
    }

    // Safely retrieve service regardless of alias casing
    const service = appointment.service || appointment.Service;

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found for this appointment",
      });
    }

    const amount = Number(service.price);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid service price",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay accepts subunits (paise)
      currency: "INR",
      receipt: `appointment_${appointment.id}`,
      notes: {
        appointmentId: String(appointment.id),
      },
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

    // 1. Signature Verification
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

    // 2. Fetch appointment with Service (using the same alias as createPaymentOrder)
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: Service,
          as: "service", // MUST match your association definition
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // 3. User verification (compare string representations)
    const currentUserId = req.user?.id || req.user?.userId || req.user?._id;
    if (String(appointment.userId) !== String(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 4. Duplicate payment check
    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already paid",
      });
    }

    // 5. Safe service & amount extraction
    const serviceData = appointment.service || appointment.Service;
    const amount = serviceData ? Number(serviceData.price) : 0;

    // 6. Save Payment & Update Appointment
    await Payment.create({
      appointmentId: appointment.id,
      userId: appointment.userId,
      amount: amount,
      gateway: "razorpay",
      transactionId: razorpay_payment_id,
      status: "paid",
      paidAt: new Date(),
    });

    await appointment.update({
      paymentStatus: "paid",
      status: "confirmed",
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment Verification Error Details:", error);

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
