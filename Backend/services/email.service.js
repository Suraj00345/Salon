const transporter = require("../config/nodemailer");

/**
 * Send Appointment Confirmation Email to Client
 * @param {Object} details - Appointment details object
 */
const sendBookingConfirmation = async ({
  userEmail,
  userName,
  serviceName,
  staffName,
  appointmentDate,
  startTime,
  price,
}) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #2c3e50; text-align: center;">Appointment Confirmed!</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Thank you for booking with us. Here are your appointment details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;"><strong>Service:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${serviceName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;"><strong>Staff Specialist:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${staffName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;"><strong>Date:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${appointmentDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;"><strong>Time:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">${startTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;"><strong>Total Price:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eeeeee;">$${price}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; color: #555555;">If you need to reschedule or cancel, please contact us at least 24 hours prior to your appointment.</p>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888888; text-align: center;">Salon Management System</p>
      </div>
    `;

    const mailOptions = {
      from: `"Salon Booking" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Appointment Confirmation - ${serviceName}`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error);
    // Suppress error so email failure doesn't roll back successful DB bookings
  }
};

const sendAppointmentReminder = async ({
  userEmail,
  userName,
  serviceName,
  staffName,
  appointmentDate,
  startTime,
}) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <div style="background-color: #4a90e2; padding: 15px; border-radius: 6px 6px 0 0; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">Appointment Reminder</h2>
        </div>

        <div style="padding: 20px 0;">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>This is a friendly reminder for your upcoming salon appointment scheduled for <strong>tomorrow</strong>!</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background-color: #f9f9f9; border-radius: 6px;">
            <tr>
              <td style="padding: 10px 15px; border-bottom: 1px solid #eeeeee;"><strong>Service:</strong></td>
              <td style="padding: 10px 15px; border-bottom: 1px solid #eeeeee;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 15px; border-bottom: 1px solid #eeeeee;"><strong>Stylist/Staff:</strong></td>
              <td style="padding: 10px 15px; border-bottom: 1px solid #eeeeee;">${staffName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 15px; border-bottom: 1px solid #eeeeee;"><strong>Date:</strong></td>
              <td style="padding: 10px 15px; border-bottom: 1px solid #eeeeee;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 15px;"><strong>Time:</strong></td>
              <td style="padding: 10px 15px;">${startTime}</td>
            </tr>
          </table>

          <p style="margin-top: 20px; color: #555555; font-size: 14px;">
            Please arrive 10 minutes prior to your scheduled time. If you need to reschedule or cancel, please contact us at least 12 hours in advance.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888888; text-align: center; margin: 0;">
          Salon Management System &bull; We look forward to seeing you!
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"Salon Booking" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Reminder: Your appointment for ${serviceName} is coming up!`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Appointment reminder email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending appointment reminder email:", error);
    // Non-blocking error handling
  }
};

module.exports = {
  sendBookingConfirmation,
  sendAppointmentReminder,
};
