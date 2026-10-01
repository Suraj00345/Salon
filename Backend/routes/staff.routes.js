const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createStaff,
  getStaff,
  getStaffById,
  updatedStaff,
  deleteStaff,
  assignService,
  getStaffAppointments,
  getStaffDashboard,
  updateStaffAppointmentStatus
} = require("../controllers/staff.controller");
const role = require("../middleware/role.middleware");

router.get("/get", getStaff);
router.get("/get/:id", getStaffById);
router.post("/create", ensureAuthenticated, role('admin'), createStaff);
router.put("/update/:id", ensureAuthenticated, role('admin','staff'), updatedStaff);
router.delete("/delete/:id", ensureAuthenticated, role('admin'), deleteStaff);
router.post("/assignService/:id", ensureAuthenticated,role('admin'), assignService);
router.get("/dashboard", ensureAuthenticated, role("staff"), getStaffDashboard);
router.get("/appointments",ensureAuthenticated,role("staff","admin"),getStaffAppointments);
router.put("/appointments/:id/status",ensureAuthenticated,role('staff',"admin"),updateStaffAppointmentStatus);

module.exports = router;
