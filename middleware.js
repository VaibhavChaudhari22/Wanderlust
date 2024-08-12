const Listing= require("./models/listing")
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema}= require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{

    if (!req.isAuthenticated()) {

        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be loggedIn First");
      return  res.redirect("/login");
    }
    next();

};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner=async(req,res,next)=>{
  let {id} = req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
       req.flash("error","You are not the owner of this listing!")
       return res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, { abortEarly: false });

  if (error) {
      const details = error.details.map(el => el.message).join(', ');
      throw new ExpressError(details, 400);
  } else {
      next();
  }
};

module.exports.validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });

  if (error) {
      const details = error.details.map(el => el.message).join(', ');
      throw new ExpressError(details, 400);
  } else {
      next();
  }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId} = req.params;
  let review= await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
       req.flash("error","You are not the owner of this review!")
       return res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.validateSearch = (req, res, next) => {
  const { error } = searchSchema.validate(req.query);
  if (error) {
      const msg = error.details.map(el => el.message).join(",");
      throw new ExpressError(msg, 400);
  } else {
      next();
  }
};