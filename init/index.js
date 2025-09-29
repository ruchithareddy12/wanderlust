const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    const Listingwithowner=initData.data.map((obj)=>({...obj,owner:"68d2d6d205e37cc323dbc15d"}));
    await Listing.insertMany(Listingwithowner);
    console.log("data initialised");
}

initDB();
