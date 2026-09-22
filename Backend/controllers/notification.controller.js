const {
  sendBookingConfirmation,
  sendAppointmentReminder,
} = require("../services/email.service");

const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    await sendBookingConfirmation({
      email,
      name: "Test User",
      appointment: {
        appointmentDate: new Date(),
        startTime: "10:00",
        endTime: "11:00",
      },
      service: {
        name: "Hair Styling",
        price: 999,
      },
      staff: {
        name: "Ananya",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Test Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
};

module.exports = {
  sendTestEmail,
};
