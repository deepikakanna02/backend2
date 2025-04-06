const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  bankName: {
    type: String,
    default: "ICICI Bank"
  },
  type: {
    type: String,
    default: "no type"
  },
  amount: {
    type: Number,
    default: 0.0,
    min: 1,
    max: 1000000
  },
  dateCreated: {
    type: Date,
    default: () => Date.now()
  },
  category: {
    type: String
  }
}, {
  collection: 'usersTransactions',
  timestamps: true
});

// **This is the key export**:
module.exports = mongoose.model('transaction', TransactionSchema);
