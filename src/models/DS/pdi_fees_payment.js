const mongoose = require('mongoose');

const Pdi_fees_payment = new mongoose.Schema({

    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'InstructorMaster'
    },
    fees_amount:{
        type:String,
        
    },
    amount_paid:{
        type:String
    },
    notes:{
        type:String
    }
   
},{timestamps:true});

module.exports = mongoose.model('Pdi_fees_payment', Pdi_fees_payment);