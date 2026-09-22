const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  rescheduleAppointment,
  cancelAppointment,
} = require("../controllers/appointment.controller");

router.post("/", ensureAuthenticated, createAppointment);
router.get("/my", ensureAuthenticated, getMyAppointments);
router.get("/:id", ensureAuthenticated, getAppointmentById);
router.put("/:id/reschedule", ensureAuthenticated, rescheduleAppointment);
router.put("/:id/cancel", ensureAuthenticated, cancelAppointment);

module.exports = router;
