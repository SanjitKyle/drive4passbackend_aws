const FeeTypeModel = require("../../models/FEE/feetype.model");

// Create
exports.createFeeType = async (req, res, next) => {
    try {
        const { feetype_name, description, late_fee, last_due_after_days } = req.body;

        const exists = await FeeTypeModel.findOne({ feetype_name });
        if (exists) return res.json({ status:false, message:"Fee Type Already Exists" });

        const data = new FeeTypeModel({
            branch_id: req.user?.branchId,
            feetype_name,
            description,
            late_fee,
            last_due_after_days,
            created_by: req.user?._id || null
        });

        await data.save();
        return res.json({ status:true, message:"Fee Type Created Successfully", data });

    } catch (err) { next(err); }
};

// UPDATE Fee Type (POST method using /fee-type/:id)
exports.updateFeeType = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { feetype_name, description } = req.body;

        if (!id) return res.json({ status:false, message:"Fee Type ID is required" });
        
        // Prevent duplicate fee type names
        const exists = await FeeTypeModel.findOne({ 
            feetype_name, 
            _id: { $ne: id } 
        });

        if (exists)
            return res.json({ status:false, message:"Fee Type name already exists" });

        const updated = await FeeTypeModel.findByIdAndUpdate(
            id,
            { feetype_name, description },
            { new:true }
        );

        if (!updated)
            return res.json({ status:false, message:"Fee Type not found" });

        return res.json({
            status:true,
            message:"Fee Type Updated Successfully",
            data:updated
        });

    } catch (err) {
        next(err);
    }
};


// Get All Fee Types
exports.getFeeTypes = async (req, res, next) => {
    try {
        const data = await FeeTypeModel.find().sort({ createdAt: -1 });
        return res.json({ status:true, message:"Fee Types Fetched Successfully", data });

    } catch (err) { next(err); }
};

// Delete Fee Type (GET method since PUT/DELETE not supported)
exports.deleteFeeType = async (req, res, next) => {
    try {
        await FeeTypeModel.findByIdAndDelete(req.params.id);
        return res.json({ status:true, message:"Fee Type Deleted Successfully" });

    } catch (err) { next(err); }
};
