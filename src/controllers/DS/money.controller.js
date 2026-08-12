const Money = require("../../models/DS/money.model");
const pupilModel = require("../../models/DS/pupil.model");
const instructorModel = require("../../models/DS/instructor_master.model")
const sell = require("../../models/DS/sale.model");
const Pricing = require("../../models/DS/price_master.model")
exports.addMoney = async (req, res, next) => {
    try {
        const { pupil_id, instructor_id, payment_method, amount, sell_id } = req.body;
        const school_id = req.user.school_id;
        const loggedInUserId = req.user._id;

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

        // 1. Create the money record first
        const created = await Money.create({
            school_id,
            pupil_id,
            instructor_id: instructor_id || null,
            payment_method,
            amount,
            sell_id,
            created_by: loggedInUserId
        });

        if (!created) {
            return res.status(403).json({
                message: "could not add money",
                success: false
            });
        }

        // 2. ONLY AFTER money is created, update the sale paid/unpaid status
        if (sell_id) {
            const sellProfile = await sell.findById(sell_id);
            if (sellProfile) {
                const packageId = sellProfile.package_id;

                // Fetch the total money paid so far for this sell_id by this pupil
                // Since the money record is already created, this will include the new payment
                const existingPayments = await Money.find({ pupil_id, sell_id, deleted_at: null });
                const totalPaidNow = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);

                // Fetch pricing info
                const pricing = await Pricing.findOne({ package_id: packageId });

                if (pricing) {
                    if (totalPaidNow >= pricing.price) {
                        await sell.findByIdAndUpdate(sell_id, { status: "Paid" }, { new: true });
                    } else {
                        await sell.findByIdAndUpdate(sell_id, { status: "Unpaid" }, { new: true });
                    }
                }
            }
        }

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

        const { payment_method, amount, instructor_id, sell_id } = req.body;

        const existingMoney = await Money.findOne({ _id: money_id, school_id });
        if (!existingMoney) {
            return res.status(404).json({
                success: false,
                message: "Money record not found"
            });
        }

        const old_sell_id = existingMoney.sell_id;

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

        if (sell_id !== undefined) {
            updateData.sell_id = sell_id;
        }

        // 1. Update the money record first securely using validated data
        const updated = await Money.findOneAndUpdate(
            { _id: money_id, school_id },
            { $set: updateData },
            { new: true }
        );

        // Helper function to robustly recalculate paid/unpaid status for a sale
        const recalculateSaleStatus = async (target_sell_id, target_pupil_id) => {
            if (!target_sell_id) return;
            const sellProfile = await sell.findById(target_sell_id);
            if (!sellProfile) return;
            
            const packageId = sellProfile.package_id;
            const allPayments = await Money.find({ pupil_id: target_pupil_id, sell_id: target_sell_id, deleted_at: null });
            const totalPaid = allPayments.reduce((sum, payment) => sum + payment.amount, 0);
            
            const pricing = await Pricing.findOne({ package_id: packageId });
            if (pricing) {
                if (totalPaid >= pricing.price) {
                    await sell.findByIdAndUpdate(target_sell_id, { status: "Paid" }, { new: true });
                } else {
                    await sell.findByIdAndUpdate(target_sell_id, { status: "Unpaid" }, { new: true });
                }
            }
        };

        const current_sell_id = updated.sell_id;
        const current_pupil_id = updated.pupil_id;

        // 2. Recalculate status for the current sale attached to this money record
        await recalculateSaleStatus(current_sell_id, current_pupil_id);

        // 3. If sell_id was changed to a different sale, recalculate status for the old sale too (since it lost money)
        if (old_sell_id && String(old_sell_id) !== String(current_sell_id)) {
            await recalculateSaleStatus(old_sell_id, current_pupil_id);
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
            deleted_at: null
        })
            .populate("pupil_id", "full_name email").populate("instructor_id", "name email").populate("sell_id")
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

exports.getPupilMoney = async (req, res, next) => {
    try {
        const pupilId = req.params.id;
        const school_id = req.user.school_id;
        if (!pupilId) {
            return res.status(404).json({
                message: "Provide Pupil id "
            })
        }

        const money = await Money.find({ pupil_id: pupilId, school_id, deleted_at: null }).populate('pupil_id').populate('instructor_id').populate('sell_id');
        return res.status(201).json(money)

    } catch (error) {
        return res.status(501).json({
            message: "Internal server error",
            success: false
        })
    }
}

exports.deleteInstructorMoney = async (req, res, next) => {
    try {
        const instructor_id = req.params.id;
        const school_id = req.user.school_id;
        const loggedInUserId = req.user._id;

        if (!instructor_id) {
            return res.status(400).json({
                success: false,
                message: "Instructor ID is required"
            });
        }

        const instructor = await instructorModel.findById(instructor_id);
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        // Find records before deleting to recalculate sales
        const recordsToDelete = await Money.find({ instructor_id, school_id, deleted_at: null });

        if (recordsToDelete.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No money records found for this instructor"
            });
        }

        // Soft delete the records
        await Money.updateMany(
            { instructor_id, school_id, deleted_at: null },
            { $set: { deleted_at: new Date(), deleted_by: loggedInUserId } }
        );

        // Recalculate sales status for affected sales
        const affectedSales = new Map();
        for (const record of recordsToDelete) {
            if (record.sell_id && record.pupil_id) {
                const key = `${record.sell_id}_${record.pupil_id}`;
                if (!affectedSales.has(key)) {
                    affectedSales.set(key, { sell_id: record.sell_id, pupil_id: record.pupil_id });
                }
            }
        }

        for (const { sell_id, pupil_id } of affectedSales.values()) {
            const sellProfile = await sell.findById(sell_id);
            if (sellProfile) {
                const packageId = sellProfile.package_id;
                const allPayments = await Money.find({ pupil_id, sell_id, deleted_at: null });
                const totalPaid = allPayments.reduce((sum, payment) => sum + payment.amount, 0);
                
                const pricing = await Pricing.findOne({ package_id: packageId });
                if (pricing) {
                    if (totalPaid >= pricing.price) {
                        await sell.findByIdAndUpdate(sell_id, { status: "Paid" }, { new: true });
                    } else {
                        await sell.findByIdAndUpdate(sell_id, { status: "Unpaid" }, { new: true });
                    }
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Instructor money records deleted successfully",
            deleted_count: recordsToDelete.length
        });

    } catch (error) {
        console.log("Delete Instructor Money Error:", error);
        next(error);
    }
};