//import { Router } from "express";

var express = require('express')
var router = express.Router()
const { check } = require('express-validator');
const {signout, signup, signin, isSignedIn} =require('../controllers/authentication.js')

router.post("/signup",[
    check("name","Name should be atleast 3 characters").isLength({min: 3 }),
    check("email","email is required").isEmail(),
    check("password","password should be atleast 5 char").isLength({ min: 5})
],signup)

router.post("/signin",[
    check("email","email is required").isEmail(),
    check("password","password field is required").isLength({ min: 5})
], signin )


router.get('/signout',signout)

router.get('/testroute',isSignedIn, (req, res)=>{
    res.json(req.authentication)
})

module.exports = router;                  //it thorws the values of router into server
