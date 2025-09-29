const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      required:true,
      default:
        "https://images.unsplash.com/photo-1652941607424-02bf3fcd0041?w=600&auto=format&fit=crop&q=60",
        set:(v)=>
          v===""?"https://plus.unsplash.com/premium_photo-1681922761648-d5e2c3972982?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2UlMjBuZWFyJTIwYmVhY2h8ZW58MHx8MHx8fDA%3D":v,
    },
  },
  price: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pool', 'Camping', 'Farms', 'Arctic','Domes','Boats'], // This ensures only these values are accepted
  },
  reviews:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review",
    }
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },

});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
