const mongoose =require('mongoose')

const Schema = mongoose.Schema

const customerSchema = new Schema ({
    email:{
        type:String,
        default:null,
    },
    phone:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        default:null,
    },
    status:{ 
        type:Boolean,
        default:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
   
})

module.exports = mongoose.model('Customer', customerSchema)