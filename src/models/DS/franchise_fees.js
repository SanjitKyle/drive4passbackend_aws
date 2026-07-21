const mongoose = require('mongoose');

const Fanchise_fees = new mongoose.Schema({
    fees_type:{
        type:String,
        enum:['Weekly','Monthly']
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'InstructorMaster'
    },
    fees_amount:{
        type:String,
        
    },
    due_rule:{
        type:String,
        enum:['Last day of month','Sunday'],
        default:'Sunday'
    },
    action_type:{
        type:String,
        enum:['add payment','payment setting']
    },
    custom_rule:{
        type:String,
        enum:['Sunday','Monday','Tuesday','Wednessday','Thusday','Friday','Saturday'],
        default:'Sunday'
    }
},{timestamps:true});

module.exports = mongoose.model('Fanchise_fees', Fanchise_fees);
