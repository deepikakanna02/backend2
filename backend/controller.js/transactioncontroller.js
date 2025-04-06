// controllers/transactionController.js

const Transaction = require('../models/transaction');
const User = require('../models/user');
const { extractTransactionFromSms } = require('../services/smsService');

/**
 * @route   POST /api/transactions/from-sms
 * @desc    Parse an SMS, save the transaction, and attach it to the authenticated user
 * @access  Private
 */
async function handleSmsTransaction(req, res) {
  try {
    const { sms } = req.body;
    const userId = req.user.id; // set by verifyToken middleware

    if (!sms) {
      return res.status(400).json({ message: 'SMS text is required' });
    }

    // 1) Parse SMS into a Transaction instance (unsaved)
    const transaction = await extractTransactionFromSms(sms);
    if (!transaction) {
      return res.status(422).json({ message: 'Unable to parse SMS format' });
    }

    // 2) Save the Transaction document
    const savedTransaction = await transaction.save();

    // 3) Push its ID into the user's transactions array
    await User.findByIdAndUpdate(
      userId,
      { $push: { transactions: savedTransaction._id } },
      { new: true }
    );

    // 4) Return the saved transaction
    return res.status(201).json({
      message: 'Transaction recorded successfully',
      transaction: savedTransaction
    });
  } catch (err) {
    console.error('Error handling SMS transaction:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * @route   POST /api/transactions
 * @desc    Create a transaction directly from JSON body and attach to user
 * @access  Private
 */
async function createTransaction(req, res) {
  try {
    const userId = req.user.id;
    const { bankName, type, amount, dateCreated, category } = req.body;

    // 1) Build and save the transaction
    const newTxn = new Transaction({
      bankName,
      type,
      amount,
      dateCreated: dateCreated ? new Date(dateCreated) : Date.now(),
      category
    });
    const savedTxn = await newTxn.save();

    // 2) Attach to the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { transactions: savedTxn._id } },
      { new: true }
    ).select('-password');

    return res.status(201).json({
      message: 'Transaction created successfully',
      transaction: savedTxn,
      user: updatedUser
    });
  } catch (err) {
    console.error('Error creating transaction:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  handleSmsTransaction,
  createTransaction
};
