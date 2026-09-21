const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

router.post("/createService", ensureAuthenticated, createService);
router.get("/getServices", ensureAuthenticated, getServices);
router.get("/getService/:id", ensureAuthenticated, getServiceById);
router.put("/updateService/:id", ensureAuthenticated, updateService);
router.delete("/deleteService/:id", ensureAuthenticated, deleteService);

module.exports = router;
