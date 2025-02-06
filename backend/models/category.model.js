const mongoose =require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema ({
    type:{ // 1: parent, 2: child
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    status:{ 
        type:Boolean,
        default:true
    },
    logo_url:{
        type:String,
        default:null,
    },
    parent_id:{ //parent id - if any
        type:Schema.Types.ObjectId,
        default:null,
        ref:'Category'
    },
   
})

module.exports = mongoose.model('Category', categorySchema)