const FeePaymentModel = require('../../models/FEE/feepayment.model');
const AdmissionModel = require('../../models/admission.model');
const FeeInstallmentModel = require('../../models/FEE/feeinstallment.model');
const mongoose = require('mongoose');

// Create a new fee payment
exports.createFeePayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      student_id,
      admission_id,
      branch_id,
      installments,
      totalAmount,
      payment_mode_id,
      transactionDetails,
      notes,
      created_by
    } = req.body;

    // 1. Validate input
    if (!student_id || !admission_id || !branch_id || !installments || !totalAmount || !payment_mode_id) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    // 2. Create the new fee payment
    const newFeePayment = new FeePaymentModel({
      student_id,
      admission_id,
      branch_id,
      installments,
      totalAmount,
      payment_mode_id,
      transactionDetails,
      notes,
      created_by,
    });

    const savedPayment = await newFeePayment.save({ session });

    // 3. Update the status and payment_id of each paid installment
    for (const item of installments) {
      await FeeInstallmentModel.findByIdAndUpdate(
        item.installment_id, {
          status: 'Paid',
          paid_at: Date.now(),
          payment_id: savedPayment._id
        }, {
          session
        }
      );
    }

    // 4. Update the fees_paid on the admission document
    await AdmissionModel.findByIdAndUpdate(
        admission_id,
        { $inc: { fees_paid: totalAmount } },
        { session }
    );


    await session.commitTransaction();
    res.status(201).json({
      message: 'Fee payment created successfully',
      payment: savedPayment
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: 'Failed to create fee payment',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// Get all fee payments
exports.getAllFeePayments = async (req, res) => {
  try {
    const payments = await FeePaymentModel.find()
      .populate('student_id', 'student_name')
      .populate('branch_id', 'name')
      .populate('payment_mode_id', 'paymentmode_name')
      .populate('installments.installment_id', 'due_date amount');
      
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve fee payments',
      error: error.message
    });
  }
};

// Get a single fee payment by ID
exports.getFeePaymentById = async (req, res) => {
    try {
        const payment = await FeePaymentModel.findById(req.params.id)
            .populate('student_id')
            .populate('admission_id')
            .populate('branch_id')
            .populate('payment_mode_id')
            .populate('installments.installment_id');

        if (!payment) {
            return res.status(404).json({ message: 'Fee payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve fee payment', error: error.message });
    }
};

// Get Fee Payments by Admission ID
exports.getFeePaymentsByAdmissionId = async (req, res, next) => {
    try {
        const payments = await FeePaymentModel.find({
            admission_id: req.params.admission_id,
            deletedAt: null
        })
        .populate('student_id', 'student_name')
        .populate('branch_id', 'name')
        .populate('payment_mode_id', 'paymentmode_name')
        .populate('installments.installment_id', 'due_date amount');

        if (!payments || payments.length === 0) {
            return res.status(200).json({
                status: true,
                message: "No fee payments found for this admission",
                data: []
            });
        }

        res.status(200).json({
            status: true,
            message: "Fee payments fetched successfully",
            data: payments
        });

    } catch (err) {
        next(err);
    }
};