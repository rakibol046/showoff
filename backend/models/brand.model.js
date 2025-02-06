const mongoose =require('mongoose')

const Schema = mongoose.Schema

const brandSchema = new Schema ({
    name:{
        type:String,
        required:true,
    },
    logo_url:{
        type:String,
        default:null,
    },
    status:{
        type:Boolean,
        default:true,
    }
})

module.exports = mongoose.model('Brand', brandSchema)