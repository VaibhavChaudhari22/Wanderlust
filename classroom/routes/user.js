const express= require("express");
const router=express.Router();



router.get("/" , (req,res) =>{
    res.send("I am on index user");
})
router.get("/:id" , (req,res) =>{
    res.send("I am on show user");
})

router.post("/" , (req,res) =>{
    res.send("I am on create user");
})

router.delete("/:id" , (req,res) =>{
    res.send("I am on delete user");
})

module.exports=router;