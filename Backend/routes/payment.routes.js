const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

router.post("/create-order", ensureAuthenticated, createPaymentOrder);
router.post("/verify", ensureAuthenticated, verifyPayment);

module.exports = router;
