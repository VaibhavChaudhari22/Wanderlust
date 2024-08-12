const Listing = require("../models/listing")
const Review= require("../models/review")

module.exports.createReview=async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            return res.status(404).send('Listing not found');
        }

        let newReview = new Review(req.body.review);
        newReview.author= req.user._id;

        // Ensure that listing.reviews is an array
        if (!listing.reviews) {
            listing.reviews = [];
        }

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("success","New Review Added!");


       res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).send("An error occurred while saving the review");
    }
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    res.redirect(`/listings/${id}`);
}