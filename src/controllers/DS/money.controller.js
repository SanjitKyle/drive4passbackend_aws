const Money = require("../../models/DS/money.model");
const pupilModel = require("../../models/DS/pupil.model");
const instructorModel = require("../../models/DS/instructor_master.model");

exports.addMoney = async (req, res, next) => {
    try {
        const { pupil_id, instructor_id, payment_method, amount } = req.body;
        const school_id = req.user.school_id;

       const loggedInUserId = req.user._id; // Assuming req.user contains the authenticated user's info
        // ✅ Validation
        if (!pupil_id || !amount) {
            return res.status(400).json({
                success: false,
                message: "Pupil ID and amount are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }

        // ✅ Check pupil
        const pupil = await pupilModel.findById(pupil_id);
        if (!pupil) {
            return res.status(404).json({
                success: false,
                message: "Pupil not found"
            });
        }

        // ✅ If instructor provided, validate
        if (instructor_id) {
            const instructor = await instructorModel.findById(instructor_id);
            if (!instructor) {
                return res.status(404).json({
                    success: false,
                    message: "Instructor not found"
                });
            }
        }

        const created = await Money.create({
            school_id,
            pupil_id,
            instructor_id: instructor_id || null,
            payment_method,
            amount,
            created_by: loggedInUserId
        });

        return res.status(201).json({
            success: true,
            message: "Money added successfully",
            data: created
        });

    } catch (error) {
        console.log("Add Money Error:", error);
        next(error);
    }
};

exports.editMoney = async (req, res, next) => {
    try {
        const money_id = req.params.id;
        const school_id = req.user.school_id;

        const { payment_method, amount, instructor_id } = req.body;

        const updateData = {};

        if (payment_method) {
            updateData.payment_method = payment_method;
        }

        if (amount) {
            if (amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be greater than 0"
                });
            }
            updateData.amount = amount;
        }

        if (instructor_id) {
            const instructor = await instructorModel.findById(instructor_id);
            if (!instructor) {
                return res.status(404).json({
                    success: false,
                    message: "Instructor not found"
                });
            }
            updateData.instructor_id = instructor_id;
        }

        const updated = await Money.findOneAndUpdate(
            { _id: money_id, school_id },
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Money record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Money updated successfully",
            data: updated
        });

    } catch (error) {
        console.log("Edit Money Error:", error);
        next(error);
    }
};

exports.getInstructorMoney = async (req, res, next) => {
    try {
        const instructor_id = req.params.id;
        const school_id = req.user.school_id;

        if (!instructor_id) {
            return res.status(400).json({
                success: false,
                message: "Instructor ID is required"
            });
        }

        const records = await Money.find({
            instructor_id,
            school_id,
            deleted_at:null
        })
        .populate("pupil_id", "full_name email").populate("instructor_id","name email")
        .sort({ createdAt: -1 });

        if (!records || records.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No money records found for this instructor"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Instructor money records retrieved successfully",
            total_records: records.length,
            data: records
        });

    } catch (error) {
        console.log("Get Instructor Money Error:", error);
        next(error);
    }
};

exports.getPupilMoney=async(req,res,next)=>{
    try{
        const pupilId=req.params.id;
        const school_id=req.user.school_id;
         if(!pupilId)
         {
            return res.status(404).json({
                message:"Provide Pupil id "
            })
         }

         const money=await Money.find({pupil_id:pupilId,school_id, deleted_at:null}).populate('pupil_id').populate('instructor_id');
         return res.status(201).json(money)

    }catch(error)
    {
        return res.status(501).json({
            message:"Internal server error",
            success:false 
        })
    }
}