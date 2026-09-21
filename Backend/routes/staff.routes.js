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

router.post("/createStaff", ensureAuthenticated, createStaff);
router.get("/getStaff", ensureAuthenticated, getStaff);
router.get("/getStaffById/:id", ensureAuthenticated, getStaffById);
router.put("/updatedStaff/:id", ensureAuthenticated, updatedStaff);
router.delete("/deleteStaff/:id", ensureAuthenticated, deleteStaff);
router.post("/assignService/:id", ensureAuthenticated, assignService);

module.exports = router;
