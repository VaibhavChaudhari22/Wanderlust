const Listing=require("../models/listing")
const{listingSchema}= require("../schema")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
 }

 module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
       req.flash("error","Listing you reqested for  does not exist")
       res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}


module.exports.createListing = async (req, res, next) => {
   let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()


    try {
        let url = req.file.path;
        let filename = req.file.filename;

        // Check if req.body.listing exists
        if (!req.body.listing) {
            return res.status(400).send("Error 400: 'listing' is required");
        }

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        
        newListing.geometry = response.body.features[0].geometry;
         
        let savedListing= await newListing.save();
        console.log(savedListing);
        req.flash("success", "New Listing created!");
        res.redirect("/listings");
    } catch (error) {
        next(error);
    }
};


module.exports.renderEditForm= async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you reqested for  does not exist")
        res.redirect("/listings")
     }
     let originalImageUrl = listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
   let listing= await Listing.findByIdAndUpdate(id ,{...req.body.listing});

   if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
   req.flash("success","Listing Updated!"); 
   res.redirect(`/listings/${id}`);
     
}

module.exports.destroyListing =async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id,{...req.body.listing});
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");

    res.redirect("/listings")
}

module.exports.searchListings = async (req, res, next) => {
    try {
        const query = req.query.q; // Search query
        const category = req.query.category; // Category filter

        let searchQuery = {};
        if (query) {
            searchQuery['$text'] = { $search: query };
        }
        if (category) {
            searchQuery['categories'] = category;
        }

        const results = await Listing.find(searchQuery).exec();
        res.render('listings/search.ejs', { results, query, category });
    } catch (e) {
        next(e);
    }
};
module.exports.filterByCategory = async (req, res, next) => {
    try {
        const { category } = req.params; // Get the category from URL params
        const filteredListings = await Listing.find({ categories: category });
        res.render("listings/index.ejs", { allListing: filteredListings });
    } catch (error) {
        next(error);
    }
};