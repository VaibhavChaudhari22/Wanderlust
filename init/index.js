const mongoose= require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("DB connect");
}).catch((err)=>{  
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"664c4108f31a61bb5a6bc959", }))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();