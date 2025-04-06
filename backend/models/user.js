// models/User.js

const mongoose = require('mongoose');
const { parseSms } = require('../smsParser/smsParser');

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
      default: '0',
    },
    savings: {
      type: String,
      default: '0',
    },
    roles: {
      type: [String],
      default: ['USER'],
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
      },
    ],
  },
  {
    collection: 'finTechUsers',
    timestamps: true,
  }
);

// === STATIC METHODS ===

// 1) Group transactions by category for a given type (credited/debited)
UserSchema.statics.getTransactionsByCategory = function (userId, transactionType) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    { $unwind: '$transactions' },
    { $match: { 'transactions.type': transactionType } },
    {
      $group: {
        _id: '$transactions.category',
        totalAmount: { $sum: '$transactions.amount' },
      },
    },
  ]);
};

// 2) Total cashflow grouped by transaction type
UserSchema.statics.getCashflow = function (userId) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    { $unwind: '$transactions' },
    {
      $group: {
        _id: '$transactions.type',
        totalAmount: { $sum: '$transactions.amount' },
      },
    },
  ]);
};

// 3) Parse a raw SMS and append it as a transaction subdocument
UserSchema.statics.addTransactionFromSms = async function (userId, sms) {
  const details = parseSms(sms);
  if (!details) {
    throw new Error('Unable to parse SMS — format not recognized');
  }

  const txn = {
    bankName: details.bankName,
    type: details.transactionType,
    amount: details.amount,
    dateCreated: new Date(details.date),
    category: details.transactionType === 'credited' ? 'income' : 'expense',
  };

  // Step 1: Fetch the user
  const user = await this.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Step 2: Subtract amount from budget if it's debited
  if (details.transactionType === 'debited') {
    const currentBudget = parseFloat(user.budget) || 0;
    const newBudget = currentBudget - txn.amount;

    user.budget = newBudget.toFixed(2); // keep 2 decimal places
  }

  // Step 3: Save transaction (assuming separate Transaction model)
  const Transaction = mongoose.model('transaction');
  const newTransaction = await Transaction.create(txn);

  // Step 4: Add transaction ref to user and save
  user.transactions.push(newTransaction._id);
  await user.save();

  return user;
};

module.exports = mongoose.model('user', UserSchema);
