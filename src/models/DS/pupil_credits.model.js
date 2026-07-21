const mongoose = require("mongoose");

const PupilCredits=new mongoose.Schema({
    school_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"school",
        required:true,
        index:true
    },
    pupil_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"pupil",
        required:true,
        index:true
        
    },
    credits:{
        type:Number,
        required:true
    },
    last_updated_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
      deleted_at: {
          type: Date,
          default: null,
        },
    
        // Audit fields
        created_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
    
        updated_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          default: null,
        },
    
        deleted_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          default: null,
        },
 

},{timestamps:true})
module.exports = mongoose.model("pupil_credits", PupilCredits);
