const { signup, login } = require("../controllers/auth.controller");
const {
  signupValidation,
  loginValidation,
} = require("../middleware/validation.middleware");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

module.exports = router;
