const express= require("express");
const app = express();
const users=require("./routes/user.js")
const posts=require("./routes/post.js")
const cookieparser = require("cookie-parser")

app.use("/users",users);
app.use("/users",posts);


app.listen(3000,()=>{
    console.log("I am on server");
})