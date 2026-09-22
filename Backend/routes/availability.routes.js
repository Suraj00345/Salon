const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createWorkingHour,
  getAvailableSlots,
} = require("../controllers/availability.controller");

router.post("/", ensureAuthenticated, createWorkingHour);
router.get("/slots", ensureAuthenticated, getAvailableSlots);


module.exports = router;