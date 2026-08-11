
const noficationStore = require('../../models/DS/notification_stored');

exports.getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await noficationStore.find({ receiver_id: userId });
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No notifications found for the user"
            });
        }
        return res.status(201).json({
            message: "Notifications fetched successfully",
            success: true,
            data: notifications
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message
        })
    }



}
exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateAll = await noficationStore.updateMany({ receiver_id: userId }, { is_read: true }, { new: true });
        if (!updateAll) {
            return res.status(404).json({
                message: "No notifications found for the user",
                success: false
            })
        }
        return res.status(200).json({
            message: "Notifications marked as read successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
    }
}

exports.MarkAsReadByUserId = async (req, res) => {
    try {
        const id = req.params.id;
        const updateAll = await noficationStore.updateMany({ receiver_id: id }, { is_read: true }, { new: true });
        if (!updateAll) {
            return res.status(404).json({
                message: "No notifications found for this user",
                success: false
            })
        }
        return res.status(200).json({
            message: "User notifications marked as read successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
    }
}

exports.GetNotificationByUserId = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await noficationStore.find({receiver_id:id});
        if(!response)
        {
            return res.status(404).json({
                message:"Could not get any notification for this user ",
                success:false
            })
        }
        return res.status(200).json({
            message:"Successfully Got Notifications",
            data:response,
            success:true

        })

    } catch (error) {
        return res.status(500).json({
            message: "internal server error ",
            success: false
        })
    }
}

exports.DeleteAllByUserId = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }

        const result = await noficationStore.deleteMany({ receiver_id: id });
        
        return res.status(200).json({
            message: `Successfully deleted all notifications for this user (${result.deletedCount} found)`,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error while deleting notifications",
            success: false,
            error: error.message
        });
    }
}
exports.DeleteNotification=async(req,res)=>{
    try{
        const id=req.params.id;
        const delted=await noficationStore.findByIdAndDelete(id);
        if(!delted){
            return res.status(403).json({
                message:"Could not deleted notification",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            message:"Successfully Deleted notification"
        })

    }catch(error)
    {
        return res.status(500).json({
            message:"Internal server error ",
            success:false
        })
    }
}