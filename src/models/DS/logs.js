const mongoose = require('mongoose');
const ActivityLogs = new mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'school',
    },
    enquire_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'enquire',
    },
    activity:{
        type:String,
        required:true
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    deleted_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    deleted_at:{
        type:Date
    }

},{timestamps:true})

module.exports=mongoose.model('activity_logs',ActivityLogs)