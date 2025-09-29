const router = require("express").Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviews.js");
const { isLoggedIn, validateReview } = require("../middleware.js");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.newReview));
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;
