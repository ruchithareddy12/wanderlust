const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    const category = req.query.category || '';
    res.render("listings/index.ejs", { allListings, category });
};

module.exports.newListing = async (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
    try {
        const url = req.file?.path || '';
        const filename = req.file?.filename || '';
        const { error } = listingSchema.validate(req.body);
        if (error) throw new ExpressError(400, error);

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();

        req.flash("success", "New listing added");
        return res.redirect(`/listings/${newListing._id}`);
    } catch (e) {
        return next(e);
    }
};


module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You don't have permission to edit");
            return res.redirect(`/listings/${id}`);
        }

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
        }

        listing.title = req.body.listing.title;
        listing.description = req.body.listing.description;
        listing.price = req.body.listing.price;
        listing.country = req.body.listing.country;
        listing.location = req.body.listing.location;

        await listing.save();
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};



module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to delete");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};
