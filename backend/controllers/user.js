const User = require("../models/user")
const Order = require("../models/order")


exports.getUserById = (req, res, next, id) =>{
 User.findById(id).exec( (err, user)=> {
    if(err || !user){
        return res.status(400).json({
            err:"No user was found in DB"
        })
    }
    req.profile = user;     // When user is found in DB
    next()
 })
}
exports.getUser = (req, res)=> {
    //TODO: get back here for password

    // bcos salt is like credentials info & shouldn't show in browser so to get rid of showing these details.
    req.profile.salt = undefined         
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
}

exports.updateUser = (req, res)=>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify : false},
        (err,user) =>{
            if(err ||!user){
                return res.status(400).json({
                    error: "you are not Authorized to update this user"
                })
            }
            user.salt = undefined
            user.encry_password = undefined      
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req, res)=>{
    Order.find({User: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "NO order in this account"
            })
        }return res.json(order)
    })
}

exports.pushOrderInPurchaseList =  (req, res, next) =>{
    let purchases = []
    //from where information is comeup
    req.body.order.products.forEach(item =>{
        purchases.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            qty: item.quantity,            //IT MAY OCCUR ERROR !!!!!!!!!!!!!!!!!!
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })
    //STORE THIS IN DB
    User.findOneAndUpdate(                  //findOneAndUpdate is used here because there is nothing in purchase array
                                            // if there is something in array then u can use find or findOne
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true} ,                              //Only updated data comes from DB
        (err,purchases)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to save purchase list"
                })
            }
            next()
        }
    )
    
}