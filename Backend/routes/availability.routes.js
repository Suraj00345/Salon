const router = require("express").Router();
const {createWorkingHour,getAvailableSlots} = require("../controllers/availability.controller");
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");



router.post("/create", ensureAuthenticated, role("admin"), createWorkingHour);
router.get("/slots", ensureAuthenticated, getAvailableSlots);

module.exports = router;
