const User = require("../models/user");
const { check, validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      //error: "oops something went wrong"
      error: errors.array()[0].msg,
      err: errors.array()[0].param,
    });
  }
// to store in DB 
  const user = new User(req.body);
  user.save((err, data) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save User in DB",
      });
    }
    res.json({
      name: data.name,
      email: data.email,
      id: data._id,
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout Successfully !!",
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body; //destructuring data
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      err: errors.array()[0].param,
    });
  }
  User.findOne({ email }, (error, data) => {
    //Note :- here we are destructuring email before, then we used it in findOne()

    
    if (error || !data) {
      return res.status(400).json({
         error: "USER email doesn't exits",
      });
    }

    

    console.log(data);

    //if there is no error and email is findout then we have check password whether it is .
    // null  dont have authenticate function  
    if (data === null || !data.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match!!",
      });
    }
    //create token
    const token = jwt.sign({ _id: data._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 }); //expire is time duration in which data is automatically deleted after defined time

    //send response to front end
    const { _id, name, email, role } = data;
    return res.json({ token, user: { _id, name, email, role } }); //it stores these data in local storage of frontend
  });
};
//protected routes
exports.isSignedIn = expressJwt({
  
  secret: process.env.SECRET,
  userProperty: "authentication", 
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.authentication && req.profile._id == req.authentication._id;

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN ,Access Denied!!! ",
    });
  }
  next();
};
