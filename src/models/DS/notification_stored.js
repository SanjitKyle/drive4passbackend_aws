const mongoose=require('mongoose');
const NotificationStored=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    redirect_url:{
        type:String,
        default:""
    },
    is_read:{
        type:Boolean,
        enum:[true, false],
        default:false
    }

     
})
module.exports = mongoose.model('notification_stored', NotificationStored);