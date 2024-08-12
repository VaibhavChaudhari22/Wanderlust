const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: {
        type: [{ type: Schema.Types.ObjectId, ref: "Review" }],
        default: []
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"user",
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    categories: {
        type: [String],
        enum: [
            'Trending',
            'Farm-house',
            'Rooms',
            'Iconic-cities',
            'Mountain',
            'Castles',
            'Amazing-pools',
            'Camping',
            'Arctic',
        ],
        required: true,
    },
});
      
listingSchema.index({ title: 'text', description: 'text' });


listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})

    }
})



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
