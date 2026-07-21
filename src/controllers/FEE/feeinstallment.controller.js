const FeeInstallmentModel = require("../../models/FEE/feeinstallment.model");
const AdmissionModel = require("../../models/admission.model");
const FeePaymentModel = require("../../models/FEE/feepayment.model");
const mongoose = require("mongoose");
// Create Fee Installments (Multiple)
exports.createBulkFeeInstallments = async (req, res, next) => {
    try {
        const { admission_id, fee_type_id, installments } = req.body;
        const created_by = req.user ? req.user._id : null;

        const admission = await AdmissionModel.findOne({
            _id: admission_id,
            deletedAt: null
        });

        if (!admission) {
            return res.status(404).json({
                status: false,
                message: "Admission not found"
            });
        }

        const branch_id = admission.branch_id;

        // Create a query to find any existing installments that match the criteria
        const existingInstallments = await FeeInstallmentModel.find({
            admission_id,
            fee_type_id,
            due_date: { $in: installments.map(i => i.due_date) },
            deletedAt: null
        });

        if (existingInstallments.length > 0) {
            const existingDates = existingInstallments.map(i => i.due_date.toISOString().split('T')[0]);
            return res.status(409).json({
                status: false,
                message: `Duplicate fee installments found for the following due dates: ${existingDates.join(', ')}`
            });
        }

        const installmentDocs = installments.map(item => ({
            admission_id,
            branch_id,
            fee_type_id,
            due_date: item.due_date,
            last_due_date: item.last_due_date,
            amount: item.amount,
            late_fee: item.late_fee || 0,
            is_late_fee_applied: item.is_late_fee_applied || false,
            status: item.status || "Due",
            created_by
        }));

        const saved = await FeeInstallmentModel.insertMany(installmentDocs);

        return res.status(201).json({
            status: true,
            message: "Fee installments created successfully",
            data: saved
        });

    } catch (err) {
        next(err);
    }
};

// Create Fee Installment (Single)
exports.createFeeInstallment = async (req, res, next) => {
    const {
        admission_id,
        fee_type_id,
        due_date,
        last_due_date,
        amount,
        late_fee,
        is_late_fee_applied,
        status,
        payment_date,
        payment_mode_id, // Required if status is 'Paid'
        transaction_id,
        notes
    } = req.body;
    const created_by = req.user ? req.user._id : null;

    try {
        // Prevent duplicate entry, ignoring soft-deleted records
        const existingInstallment = await FeeInstallmentModel.findOne({
            admission_id,
            fee_type_id,
            due_date,
            deletedAt: null
        });

        if (existingInstallment) {
            return res.status(409).json({
                status: false,
                message: "A fee installment with the same admission, fee type, and due date already exists."
            });
        }
    } catch (err) {
        return next(err);
    }

    // If status is 'Due' or not provided, use the simple logic
    if (!status || status === "Due") {
        try {
            const admission = await AdmissionModel.findOne({ _id: admission_id, deletedAt: null });
            if (!admission) {
                return res.status(404).json({ status: false, message: "Admission not found" });
            }

            const newInstallment = new FeeInstallmentModel({
                admission_id,
                branch_id: admission.branch_id,
                fee_type_id,
                due_date,
                last_due_date,
                amount,
                late_fee: late_fee || 0,
                is_late_fee_applied: is_late_fee_applied || false,
                status: "Due",
                created_by
            });

            const saved = await newInstallment.save();
            return res.status(201).json({
                status: true,
                message: "Fee installment created successfully",
                data: saved
            });
        } catch (err) {
            return next(err);
        }
    }

    // If status is 'Paid', handle the full transaction
    if (status === "Paid") {
        if (!payment_mode_id) {
            return res.status(400).json({
                status: false,
                message: "payment_mode_id is required when creating a paid installment."
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const admission = await AdmissionModel.findOne({ _id: admission_id, deletedAt: null }).session(session);
            if (!admission) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ status: false, message: "Admission not found" });
            }

            // 1. Create the installment
            const newInstallment = new FeeInstallmentModel({
                admission_id,
                branch_id: admission.branch_id,
                fee_type_id,
                due_date,
                last_due_date,
                amount,
                late_fee,
                is_late_fee_applied,
                status: "Paid",
                paid_at: payment_date,
                created_by,
                // payment_id will be added after payment is created
            });
            const savedInstallment = await newInstallment.save({ session });

            // 2. Create the corresponding fee payment
            const paymentTxDetails = transaction_id ? { transaction_id } : undefined;
            const newFeePayment = new FeePaymentModel({
                student_id: admission.student_id,
                admission_id,
                branch_id: admission.branch_id,
                installments: [{
                    installment_id: savedInstallment._id,
                    amount: amount
                }],
                totalAmount: amount,
                payment_date,
                payment_mode_id,
                transactionDetails: paymentTxDetails,
                notes,
                created_by,
            });
            const savedPayment = await newFeePayment.save({ session });

            // 3. Link the payment back to the installment
            savedInstallment.payment_id = savedPayment._id;
            await savedInstallment.save({ session });

            // 4. Update the admission record
            await AdmissionModel.findByIdAndUpdate(
                admission_id,
                { $inc: { fees_paid: amount } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({
                status: true,
                message: "Paid fee installment and payment created successfully",
                data: {
                    installment: savedInstallment,
                    payment: savedPayment
                }
            });

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            return next(err);
        }
    }

    // Handle any other status values if necessary
    return res.status(400).json({ status: false, message: "Invalid status value provided." });
};

// Get All Fee Installments
exports.getFeeInstallments = async (req, res, next) => {
    try {
        const data = await FeeInstallmentModel.find({ deletedAt: null })
            .sort({ due_date: 1 })
            .populate("admission_id")
            .populate("fee_type_id");

        return res.json({
            status: true,
            message: "Fee installments fetched successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};

// Get Fee Installments by Admission ID
exports.getFeeInstallmentsByAdmissionId = async (req, res, next) => {
    try {
        const installments = await FeeInstallmentModel.find({
            admission_id: req.params.admission_id,
            deletedAt: null,
            // payment_id: null
        })
            .sort({ due_date: 1 })
            .populate("fee_type_id", "feetype_name") // Select only feetype_name
            .populate("payment_id") // Populate payment info
            .lean(); // Use lean for performance and plain objects

        // Handle case where no installments are found
        if (!installments || installments.length === 0) {
            return res.json({
                status: true,
                message: "No fee installments found for this admission",
                data: []
            });
        }

        // Manually format the output to include only specified fields
        const formattedData = installments.map(inst => {
            return {
                _id: inst._id,
                due_date: inst.due_date,
                amount: inst.amount,
                last_due_date: inst.last_due_date,
                late_fee: inst.late_fee,
                is_late_fee_applied: inst.is_late_fee_applied,
                status: inst.status,
                fee_type_id: inst.fee_type_id ? inst.fee_type_id._id : null, // Pass fee_type_id
                feetype_name: inst.fee_type_id ? inst.fee_type_id.feetype_name : null,
                payment_date: inst.paid_at || (inst.payment_id ? inst.payment_id.paymentDate : null),
                payment_mode_id: inst.payment_id ? inst.payment_id.payment_mode_id : null,
                transactionDetails: inst.payment_id ? inst.payment_id.transactionDetails : null
            };
        });

        return res.json({
            status: true,
            message: "Fee installments fetched successfully for the given admission",
            data: formattedData
        });

    } catch (err) {
        next(err);
    }
};

// Get Fee Installment By ID
exports.getFeeInstallmentById = async (req, res, next) => {
    try {
        const data = await FeeInstallmentModel.findOne({
            _id: req.params.id,
            deletedAt: null
        })
            .populate("admission_id")
            .populate('fee_type_id');

        if (!data)
            return res.json({ status: false, message: "Fee installment not found" });

        return res.json({
            status: true,
            message: "Fee installment fetched successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};

// Update Fee Installment (POST)
exports.updateFeeInstallment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const installmentId = req.params.id;
        const { status, payment_mode_id, transaction_id, payment_date, amount, due_date, last_due_date } = req.body;

        const existingInstallment = await FeeInstallmentModel.findOne({ _id: installmentId, deletedAt: null }).session(session);

        if (!existingInstallment) {
            await session.abortTransaction();
            session.endSession();
            return res.json({ status: false, message: "Fee installment not found" });
        }

        // If status changes from Due to Paid
        if (existingInstallment.status !== 'Paid' && status === 'Paid') {
            if (!payment_mode_id) {
                await session.abortTransaction();
                session.endSession();
                return res.json({ status: false, message: "payment_mode_id is required to mark as Paid." });
            }

            const admission = await AdmissionModel.findOne({ _id: existingInstallment.admission_id, deletedAt: null }).session(session);

            // Create Fee Payment
            const paymentTxDetails = transaction_id ? { transaction_id } : undefined;
            const newFeePayment = new FeePaymentModel({
                student_id: admission.student_id,
                admission_id: admission._id,
                branch_id: admission.branch_id,
                installments: [{
                    installment_id: existingInstallment._id,
                    amount: existingInstallment.amount
                }],
                totalAmount: existingInstallment.amount,
                paymentDate: payment_date || new Date(),
                payment_mode_id,
                transactionDetails: paymentTxDetails,
                created_by: req.user ? req.user._id : null,
            });
            const savedPayment = await newFeePayment.save({ session });

            // Update Installment
            existingInstallment.status = 'Paid';
            existingInstallment.paid_at = payment_date || new Date();
            existingInstallment.payment_id = savedPayment._id;
            existingInstallment.due_date = due_date || existingInstallment.due_date;
            existingInstallment.last_due_date = last_due_date || existingInstallment.last_due_date;
            existingInstallment.amount = amount || existingInstallment.amount;

            await existingInstallment.save({ session });

            // Update Admission Fees Paid
            await AdmissionModel.findByIdAndUpdate(
                admission._id,
                { $inc: { fees_paid: existingInstallment.amount } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
            return res.json({
                status: true,
                message: "Fee installment updated to Paid successfully",
                data: existingInstallment
            });
        } else {
            // Standard update for Due -> Due or updating basic fields
            const updated = await FeeInstallmentModel.findOneAndUpdate(
                { _id: req.params.id, deletedAt: null },
                req.body,
                { new: true, session }
            );
            await session.commitTransaction();
            session.endSession();
            return res.json({
                status: true,
                message: "Fee installment updated successfully",
                data: updated
            });
        }

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }

    // If status is being set to 'Paid', handle the full payment transaction
    if (status === "Paid") {
        if (!payment_mode_id || !payment_date) {
            return res.status(400).json({
                status: false,
                message: "payment_mode_id and payment_date are required when marking an installment as Paid."
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Find the installment and ensure it's not already paid
            const installment = await FeeInstallmentModel.findOne({ _id: installment_id, deletedAt: null }).session(session);
            if (!installment) {
                throw new Error("Fee installment not found");
            }
            if (installment.status === "Paid" && installment.payment_id) {
                throw new Error("This installment has already been paid.");
            }

            // 2. Find the related admission record
            const admission = await AdmissionModel.findById(installment.admission_id).session(session);
            if (!admission) {
                throw new Error("Related admission record not found");
            }

            // 3. Create the Fee Payment record
            const totalAmount = installment.amount + (installment.is_late_fee_applied ? installment.late_fee : 0);
            const feePayment = new FeePaymentModel({
                student_id: admission.student_id,
                admission_id: admission._id,
                branch_id: admission.branch_id,
                installments: [{
                    installment_id: installment._id,
                    amount: totalAmount
                }],
                totalAmount,
                payment_date,
                payment_mode_id,
                transactionDetails,
                notes,
                created_by: updated_by,
            });
            const savedPayment = await feePayment.save({ session });

            // 4. Update the Fee Installment record
            installment.status = "Paid";
            installment.paid_at = payment_date;
            installment.payment_id = savedPayment._id;
            installment.last_update_by = updated_by;
            const updatedInstallment = await installment.save({ session });

            // 5. Update the admission record with the paid amount
            await AdmissionModel.findByIdAndUpdate(
                admission._id,
                { $inc: { fees_paid: totalAmount } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                status: true,
                message: "Installment successfully paid and recorded",
                data: {
                    installment: updatedInstallment,
                    payment: savedPayment
                }
            });

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            // Customize error response
            if (err.message.includes("not found") || err.message.includes("already been paid")) {
                return res.status(404).json({ status: false, message: err.message });
            }
            return next(err);
        }
    }

    return res.status(400).json({ status: false, message: "Invalid request data." });
};


// Soft Delete Fee Installment
exports.deleteFeeInstallment = async (req, res, next) => {
    try {
        const deleted = await FeeInstallmentModel.findByIdAndUpdate(
            req.params.id,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!deleted)
            return res.json({ status: false, message: "Fee installment not found" });

        return res.json({
            status: true,
            message: "Fee installment deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};
