const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/service.controller");
const role = require("../middleware/role.middleware");

router.post("/createService", ensureAuthenticated, role('admin'), createService);
router.get("/getServices", getServices);
router.get("/getService/:id", getServiceById);
router.put("/updateService/:id", ensureAuthenticated, role('admin'), updateService);
router.delete("/deleteService/:id", ensureAuthenticated, role('admin'), deleteService);

module.exports = router;
