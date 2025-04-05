// node-backend/models/User.js

const mongoose = require('mongoose');
// node-backend/models/User.js

const mongoose = require('mongoose');
const { parseSms } = require('../utils/smsParser');

const transactionSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
    max: 1000000
  },
  dateCreated: {
    type: Date,
    default: () => Date.now()
  },
  category: {
    type: String,
    required: true
  }
});

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      alias: 'id',
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      select: false,
    },
    budget: {
      type: String,
      required: true,
    },
    savings: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ['USER'],
    },
    transactions: [transactionSchema],
  },
  {
    collection: 'finTechUsers',
    timestamps: true,
  }
);

// --- STATIC HELPERS ---

// 1) Group transactions by category for a given type (income/expense)
UserSchema.statics.getTransactionsByCategory = function (userId, transactionType) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    { $unwind: "$transactions" },
    { $match: { "transactions.type": transactionType } },
    {
      $group: {
        _id: "$transactions.category",
        totalAmount: { $sum: "$transactions.amount" },
      },
    },
  ]);
};

// 2) Total cashflow grouped by type
UserSchema.statics.getCashflow = function (userId) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    { $unwind: "$transactions" },
    {
      $group: {
        _id: "$transactions.type",
        totalAmount: { $sum: "$transactions.amount" },
      },
    },
  ]);
};

// 3) Parse a raw SMS and append it as a transaction
UserSchema.statics.addTransactionFromSms = async function (userId, sms) {
  const details = parseSms(sms);
  if (!details) {
    throw new Error('Unable to parse SMS — format not recognized');
  }

  const txn = {
    bankName:    details.bankName,
    type:        details.transactionType,          // "credited" or "debited"
    amount:      details.amount,
    dateCreated: new Date(details.date),           // parse "03-Apr-25"
    category:    details.transactionType === 'credited' ? 'income' : 'expense'
  };

  // Push and return the updated document
  return this.findByIdAndUpdate(
    userId,
    { $push: { transactions: txn } },
    { new: true, runValidators: true }
  );
};

module.exports = mongoose.model('User', UserSchema);
