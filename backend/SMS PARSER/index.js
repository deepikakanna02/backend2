const { parseSms } = require("./smsParser");

const sms =
  "ICICI Bank Acct XX623 debited for Rs 40.00 on 03-Apr-25; JUSTVEND PRIVAT credited. UPI:509307996753. Call 18002692 for dispute. SMS BLOCK 923 to 9275676766.";

const details = parseSms(sms);

if (details) {
  console.log("Extracted SMS Details:");
  console.log("Bank Name:", details.bankName);
  console.log("Transaction Type:", details.transactionType);
  console.log("Amount:", details.amount);
  console.log("Date:", details.date);
} else {
  console.error("Failed to parse SMS details.");
}
