const express = require("express");
const User = require('../models/Schema');

const router = express.Router();

// Register 

router.post("/register", async(req,res)=>{
    const {firstname,  lastname, mobileNumber,email,password}= req.body;

    try{
        if (!firstname ||lastname ||mobileNumber  || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }

        const userExists = await User.findOne({email});
        if (userExists){
            return res
            .status(400)
            .json({message: "user already exits" });
        }
        const user = await User.create({firstname,  lastname, mobileNumber,email,password});
        res.status(201).json({
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            mobileNumber: user.mobileNumber,
            email: user.email,
        })
    } catch(err){
        res.status(500).json({message: "Server Error"})
    }
})


//  Login

router.post('/login', async(req,res)=>{
    const {mobileNumber,email,password}= req.body;
    try{
         if ( !email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({message:"Invalid email or password"})
        }
        res.status(200).json({
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            mobileNumber: user.mobileNumber,
            email: user.email,
        })
    }
    catch (err){
        res.status(500).json({message:"server error"})
    }
})

export default router;