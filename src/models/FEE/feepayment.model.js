const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);

const feePaymentSchema = new mongoose.Schema({
  receiptNumber: {
    type: Number,
    unique: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  admission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admission',
    required: true
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'branch',
    required: true
  },
  installments: [
    {
      installment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fee_installments',
        required: true
      },
      amount: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  payment_date: {
    type: Date,
    required: true
  },
  payment_mode_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'payment_modes',
    required: true
  },
  transactionDetails: {
    type: Map,
    of: String
  },
  notes: {
    type: String
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
}, { timestamps: true });

feePaymentSchema.plugin(mongooseSequence, {
  inc_field: 'receiptNumber',
  id: 'fee_payment_receipt_seq',
  start_seq: 1000
});

const FeePayment = mongoose.model('fee_payment', feePaymentSchema);

module.exports = FeePayment;
