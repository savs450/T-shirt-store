const mongoose = require("mongoose")
 
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique : true
    }
},{timestamps: true})                 //timestamp is used when we add something new it records the current time

module.exports = mongoose.model("Category",categorySchema)