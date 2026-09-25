const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  getUsers,
  updateUserStatus,
  getAppointments,
  updateAppointmentStatus,
  getDashboardStats,
} = require("../controllers/admin.controller");
const role = require("../middleware/role.middleware");

router.get("/users",ensureAuthenticated,getUsers);
router.put("/users/:id/status",ensureAuthenticated,updateUserStatus);
router.get("/appointments",ensureAuthenticated, role("admin") ,getAppointments);
router.put("/appointments/:id/status",ensureAuthenticated, role('admin','staff'), updateAppointmentStatus);
router.get("/dashboard",ensureAuthenticated, role('admin','staff'), getDashboardStats)


module.exports = router;