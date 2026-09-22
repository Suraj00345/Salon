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

router.post("/create", ensureAuthenticated, createStaff);
router.get("/get", ensureAuthenticated, getStaff);
router.get("/get/:id", ensureAuthenticated, getStaffById);
router.put("/update/:id", ensureAuthenticated, updatedStaff);
router.delete("/delete/:id", ensureAuthenticated, deleteStaff);
router.post("/assignService/:id", ensureAuthenticated, assignService);

module.exports = router;
