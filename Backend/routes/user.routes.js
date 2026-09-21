const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/user.controller");

router.get("/getProfile", ensureAuthenticated, getProfile);
router.put("/updateProfile", ensureAuthenticated, updateProfile);


module.exports = router;