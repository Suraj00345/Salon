const router = require("express").Router();
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  createReview,
  getServiceReviews,
  updateReview,
  deleteReview,
  respondToReview,
} = require("../controllers/review.controller");
const role = require("../middleware/role.middleware");

router.post("/", ensureAuthenticated, role("customer"), createReview);
router.get("/service/:serviceId", ensureAuthenticated, getServiceReviews);
router.put("/:id", ensureAuthenticated, updateReview);
router.delete("/:id", ensureAuthenticated, deleteReview);
router.post("/:id/respond", ensureAuthenticated, role("staff"), respondToReview);


module.exports = router;