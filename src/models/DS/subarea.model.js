const mongoose=require('mongoose');
const subarea=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    area:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'area'
    },
    postcode:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['true','false'],
        default:'false'
    }
})
module.exports = mongoose.model('subarea', subarea);