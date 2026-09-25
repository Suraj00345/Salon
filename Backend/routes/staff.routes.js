const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createStaff,
  getStaff,
  getStaffById,
  updatedStaff,
  deleteStaff,
  assignService,
} = require("../controllers/staff.controller");
const role = require("../middleware/role.middleware");

router.post("/create", ensureAuthenticated, role('admin'), createStaff);
router.get("/get", getStaff);
router.get("/get/:id", getStaffById);
router.put("/update/:id", ensureAuthenticated, role('admin'), updatedStaff);
router.delete("/delete/:id", ensureAuthenticated, role('admin'), deleteStaff);
router.post("/assignService/:id", ensureAuthenticated,role('admin'), assignService);

module.exports = router;
