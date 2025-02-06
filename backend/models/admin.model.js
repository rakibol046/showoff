const mongoose =require('mongoose')

const Schema = mongoose.Schema

const adminSchema = new Schema ({
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        default:null,
    },
    password:{
        type:String,
        required:true,
    },
    profile_picture: {
        type: String,
        default: "",
    } 
})

module.exports = mongoose.model('Admin', adminSchema)