const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  getUsers,
  updateUserStatus,
  getAppointments,
  updateAppointmentStatus,
  getDashboardStats,
} = require("../controllers/admin.controller");

router.get("/users",ensureAuthenticated,getUsers);
router.put("/users/:id/status",ensureAuthenticated,updateUserStatus);
router.get("/appointments",ensureAuthenticated,getAppointments);
router.put("/appointments/:id/status",ensureAuthenticated,updateAppointmentStatus);
router.get("/dashboard",ensureAuthenticated,getDashboardStats)


module.exports = router;