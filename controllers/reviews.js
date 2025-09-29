const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.newReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        const newReview = new Review({
            comment: req.body.review.comment,
            rating: req.body.review.rating,
            author: req.user._id
        });
        await newReview.save();
        listing.reviews.push(newReview._id);
        await listing.save();
        req.flash("success", "Review added successfully!");
        return res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.deleteReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted");
        return res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};
