const { parseSms } = require("../smsParser/smsParser");
const Transaction = require("../models/transaction");

/**
 * Parses the SMS and returns a Transaction object (not saved yet)
 * @param {string} sms - The raw SMS text
 * @returns {Transaction|null}
 */
async function extractTransactionFromSms(sms) {
  const details = parseSms(sms);
  if (!details) return null;

  const transaction = new Transaction({
    bankName: details.bankName,
    type: details.transactionType,
    amount: details.amount,
    dateCreated: new Date(details.date),
    category: "no cat" // This can be filled later by the user
  });

  return transaction;
}

module.exports = { extractTransactionFromSms };
