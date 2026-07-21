
const noficationStore=require('../../models/DS/notification_stored');

exports.getNotification=async(req,res)=>{
    try{
        const userId=req.user._id;
        const notifications=await noficationStore.find({ receiver_id: userId });
        if(!notifications || notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No notifications found for the user"
            });
        }  
        return res.status(201).json({
            message:"Notifications fetched successfully",
            success:true,
            data:notifications
        }) 

    }catch(error)
    {
        return res.status(500).json({
            message:"Server error",
            success:false,
            error:error.message
        })
    }
    

    
}
exports.markAsRead=async(req,res)=>{
    try{
        const userId=req.user._id;
        const updateAll=await noficationStore.updateMany({receiver_id:userId},{is_read:true},{new:true});
        if(!updateAll){
            return res.status(404).json({
                message:"No notifications found for the user",
                success:false
            })
        }
        return res.status(200).json({
            message:"Notifications marked as read successfully",
            success:true
        })

    }catch(error)
    {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}