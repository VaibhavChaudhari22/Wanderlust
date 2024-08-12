const express= require("express");
const router=express.Router();

router.get("/" , (req,res) =>{
    res.send("I am on index post");
})
router.get("/:id" , (req,res) =>{
    res.send("I am on show post");
})

router.post("/" , (req,res) =>{
    res.send("I am on create post");
})

router.delete("/:id" , (req,res) =>{
    res.send("I am on delete post]");
})

module.exports=router;

