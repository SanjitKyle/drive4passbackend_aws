const Transfer = require('../../models/DS/transfer.model');
const NotificationToken = require("../../models/DS/fcmtokenstore");
const { sendNotification } = require('./message_token_store');
const pupilModel = require('../../models/DS/pupil.model');

// Create Transfer
exports.createTransfer = async (req, res, next) => {
    try {
        const {
            pupil_id,
            transfer_from,
            transfer_to,
            reason
        } = req.body;

        const newTransfer = await Transfer.create({
            pupil_id,
            transfer_from,
            transfer_to,
            reason
        });
        const pupulProfile = await pupilModel.findById(pupil_id)
        pupulProfile.instructor_id=transfer_to;
        await pupulProfile.save();
        const userToSendNotification = await NotificationToken.findOne({ user: transfer_to });
        const responsetogetnotifaction = await sendNotification({
            token: userToSendNotification?.token,
            title: "Pupil Transferred",
            body: `${pupulProfile?.full_name} has been transferred to you.`,
            data: { route: "/enquiries" }
        });
        console.log('error to send notifications', responsetogetnotifaction)
        return res.status(201).json({
            success: true,
            message: 'Transfer created successfully',
            data: newTransfer
        });

    } catch (error) {
        next(error);
    }
};


// Get All Transfers
exports.getTransfers = async (req, res, next) => {
    try {
        const transfers = await Transfer.find()
            .populate('pupil_id')
            .populate('transfer_from')
            .populate('transfer_to')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: transfers.length,
            data: transfers
        });

    } catch (error) {
        next(error);
    }
};
exports.getTransferPupilByInstructorId = async (req, res) => {
    try {
        const transfers = await Transfer.find({
            transfer_to: req.params.id
        })
        .populate('pupil_id')
        .populate('transfer_from')
        .populate('transfer_to');

        if (transfers.length === 0) {
            return res.status(404).json({
                message: "Did not get any transferred pupils for this instructor",
                success: false
            });
        }

        return res.status(200).json({
            message: 'Successfully got transferred pupils',
            success: true,
            transfer: transfers
        });

    } catch (error) {
        console.log('error', error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

// Get Transfer By Id
exports.getTransferById = async (req, res, next) => {
    try {
        const transfer = await Transfer.findById(req.params.id)
            .populate('pupil_id')
            .populate('transfer_from')
            .populate('transfer_to');

        if (!transfer) {
            return res.status(404).json({
                success: false,
                message: "Transfer not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: transfer
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid transfer ID"
            });
        }
        next(error);
    }
};

exports.EditTransfer=async(req, res)=>{
    try{
        const result=await Transfer.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        if(result){
            if (result.pupil_id && result.transfer_to) {
                const pupulProfile = await pupilModel.findById(result.pupil_id);
                if (pupulProfile) {
                    pupulProfile.instructor_id = result.transfer_to;
                    await pupulProfile.save();
                }
            }
            return res.status(201).json({
                message:"Transfer updated successfully",
                success:true,
                data:result
            })
        }
        return res.status(401).json({
            message:"Transfer not edited",
            success:false
        })
    }catch(error)
    {
        return res.status(501).json({
            message:"Internal server error",
            sucess:false,
        })
    }
}
exports.deleteTransfer=async(req,res)=>{
    try{
        const result=await Transfer.findByIdAndDelete(req.params.id);
        if(result)
        {
            return res.status(201).json({
                message:"Transfer deleted successfully",
                success:true,
                data:result
            })
        }
        return res.status(404).json({
            message:"Transfer not found or already deleted",
            success:false 
        })

    }catch(error){
        return res.status(501).json({
            message:"Internal server error",
            success:false
        })
    }
}
