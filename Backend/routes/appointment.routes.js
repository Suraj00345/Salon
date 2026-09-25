const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  rescheduleAppointment,
  cancelAppointment,
} = require("../controllers/appointment.controller");
const role = require("../middleware/role.middleware");

router.post("/", ensureAuthenticated, role('customer'), createAppointment);
router.get("/my", ensureAuthenticated, role('customer'), getMyAppointments);
router.get("/:id", ensureAuthenticated, getAppointmentById);
router.put("/:id/reschedule", ensureAuthenticated, role('customer'), rescheduleAppointment);
router.put("/:id/cancel", ensureAuthenticated, role('customer'), cancelAppointment);

module.exports = router;
