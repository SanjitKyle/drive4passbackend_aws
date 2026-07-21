const PaymentModeModel = require('../../models/FEE/paymentmode.model');

// Create Payment Mode
exports.createPaymentMode = async (req, res, next) => {
    try {
        const { paymentmode_name, description } = req.body;
        const created_by = req.user ? req.user._id : null;

        // Check duplicate only for non-deleted
        const exists = await PaymentModeModel.findOne({ paymentmode_name, deletedAt: null });
        if (exists) {
            return res.json({
                status: false,
                message: "Payment Mode already exists",
                paymentmode_name
            });
        }

        // Create New Mode
        const mode = await PaymentModeModel.create({
            paymentmode_name,
            description,
            created_by
        });

        return res.json({
            status: true,
            message: "Payment Mode created successfully",
            data: {
                _id: mode._id,
                paymentmode_name: mode.paymentmode_name,
                description: mode.description,
                created_at: mode.createdAt
            }
        });

    } catch (err) { 
        next(err); 
    }
};


// Get All Payment Modes
exports.getPaymentModes = async (req, res, next) => {
    try {
        const data = await PaymentModeModel
            .find({ deletedAt:null })
            .sort({ createdAt:-1 });

        return res.json({
            status:true,
            message:"Payment Modes fetched successfully",
            data:data.map(m => ({
                _id:m._id,
                paymentmode_name:m.paymentmode_name,
                description:m.description,
                created_at:m.createdAt
            }))
        });

    } catch (err) { next(err); }
};


// Update Payment Mode
exports.updatePaymentMode = async (req, res, next) => {
    try {
        const { paymentmode_name, description } = req.body;
        const id = req.params.id;

        const exists = await PaymentModeModel.findOne({ paymentmode_name, _id:{ $ne:id } });
        if (exists) return res.json({ status:false, message:"Payment Mode name already exists" });

        const updated = await PaymentModeModel.findByIdAndUpdate(
            id, 
            { paymentmode_name, description },
            { new:true }
        );

        if (!updated) return res.json({ status:false, message:"Payment Mode not found" });

        return res.json({
            status:true,
            message:"Payment Mode updated successfully",
            data:{
                _id:updated._id,
                paymentmode_name:updated.paymentmode_name,
                description:updated.description,
                created_at:updated.createdAt
            }
        });

    } catch (err) { next(err); }
};


// Soft Delete
exports.deletePaymentMode = async (req, res, next) => {
    try {
        const deleted = await PaymentModeModel.findByIdAndUpdate(
            req.params.id,
            { deletedAt:new Date() },
            { new:true }
        );

        if (!deleted) return res.json({ status:false, message:"Payment Mode not found" });

        return res.json({
            status:true,
            message:"Payment Mode deleted successfully"
        });

    } catch (err) { next(err); }
};
