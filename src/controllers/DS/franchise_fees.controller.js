const franchise_fees = require("../../models/DS/franchise_fees");

exports.AddMoney = async (req, res) => {
    try {

        const { fees_type, instructor, fees_amount, due_rule, custom_rule ,action_type} = req.body;
        if(action_type==="payment setting"){
            const findExistOrNot=await franchise_fees.findOne({instructor});
            if(!findExistOrNot)
            {
                const ress=await franchise_fees.create(req.body);
                if(ress)
                {
                    return res.status(200).json({
                        message:"successfully saved payment settings",
                        success:true
                    })
                }
                return res.status(403).json({
                    message:"Could not save payment settings",
                    success:false
                })
            }
            const updated=await franchise_fees.findByIdAndUpdate(findExistOrNot._id, req.body, { new: true });
            if(!updated)
            {
                return res.status(403).json({
                    message:"could not update payment settings",
                    success:false
                })
            }
            return res.status(200).json({
                message:"successfully updated settings",
                success:true
            })
        }
        const response = await franchise_fees.create(req.body);
        if (response) {
            return res.status(200).json({
                message: 'Successfully add money',
                success: true,
                response
            })
        } else {
             return res.status(400).json({
                 message: 'Could not add money',
                 success: false
             })
        }
    } catch (error) {
        console.log('error', error);
        return res.status(501).json({
            message: "Internal server error",
            success: false
        })
    }
}

exports.GetMoneyByInstructor=async(req,res)=>{
    try{
        const instructor_id=req.params.id;
        const response=await franchise_fees.find({instructor:instructor_id});
        if(!response || response.length === 0)
        {
            return res.status(404).json({
                message:"Could not found any franchise fees payment record",
                success:false
            })
        }

        return res.status(200).json({
            message:"Successfully get all fees payment record",
            success:true,
            response
        })
    }catch(error){
        return res.status(501).json({
            message:"Internal server error",
            success:false
        })
    }
}
exports.GetAllRecords=async(req,res)=>{
    try{
        const response=await franchise_fees.find({});
        if(!response || response.length === 0)
        {
            return res.status(404).json({
                message:"could not get any franchise fees payment",
                success:false
            })
        }
        return res.status(200).json({
            message:"Successfully get franchise fees payment records",
            success:true,
            response
        })

    }catch(error){
        return res.status(501).json({
            message:"internal server error",
            success:false
        })
    }
}
exports.DeletePayment=async(req,res)=>{
    try{

        const response=await franchise_fees.findByIdAndDelete(req.params.id);
        if(!response)
        {
            return res.status(404).json({
                message:"could not find or delete payment record",
                success:false
            })
        }
        return res.status(200).json({
            message:"Successfully delete payment record",
            success:true
        })
    }catch(error)
    {
        return res.status(501).json({
            message:"Internal server error",
            success:false
        })
    }
}
