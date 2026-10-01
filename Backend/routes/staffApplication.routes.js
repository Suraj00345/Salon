const router = require("express").Router();
const {
  createStaffApplication,
  getMyStaffApplication,
  getStaffApplications,
  approveStaffApplication,
  rejectStaffApplication,
} = require("../controllers/staffApplication.controller");

const { ensureAuthenticated } = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.post("/", ensureAuthenticated, role("customer"), createStaffApplication);
router.get("/my", ensureAuthenticated, role("customer"), getMyStaffApplication);
router.get("/admin", ensureAuthenticated, role("admin"), getStaffApplications);
router.put("/admin/:id/approve", ensureAuthenticated, role("admin"), approveStaffApplication);
router.put("/admin/:id/reject", ensureAuthenticated, role("admin"), rejectStaffApplication);

module.exports = router;
