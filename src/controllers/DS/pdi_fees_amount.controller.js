const pdi_fees_payment = require("../../models/DS/pdi_fees_payment");

exports.create_fees_amount = async (req, res) => {
    try {
        const { instructor, fees_amount, amount_paid, notes } = req.body;
        const existingPayment = await pdi_fees_payment.findOne({ instructor });
        if (existingPayment) {
            const response = await pdi_fees_payment.findByIdAndUpdate(existingPayment._id, { fees_amount, amount_paid, notes }, { new: true });
            if (response) {
                return res.status(200).json({
                    message: "Successfully update pdi training payment",
                    success: true,
                    data: response
                });
            }
            return res.status(401).json({
                message: "could not update pdi amount",
                success: false
            });
        }
        const response = await pdi_fees_payment.create({ instructor, fees_amount, amount_paid, notes });
        if (response) {
            return res.status(200).json({
                message: "successfully created pdi payment",
                success: true,
                data: response
            });
        }
        return res.status(401).json({
            message: "could not create pdi fees amount",
            success: false
        });

    } catch (error) {
        return res.status(501).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

exports.get_all_fees_amount = async (req, res) => {
    try {
        const data = await pdi_fees_payment.find();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.get_fees_amount_by_id = async (req, res) => {
    try {
        const data = await pdi_fees_payment.findById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Not found" });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.get_fees_amount_by_instructor_id = async (req, res) => {
    try {
        const data = await pdi_fees_payment.findOne({ instructor: req.params.instructorId });
        if (!data) return res.status(404).json({ success: false, message: "Not found" });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.delete_fees_amount = async (req, res) => {
    try {
        const data = await pdi_fees_payment.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Not found" });
        return res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};