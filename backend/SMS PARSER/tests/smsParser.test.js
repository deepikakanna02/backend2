const { parseSms } = require("../smsParser");

const sms =
  "ICICI Bank Acct XX623 debited for Rs 40.00 on 03-Apr-25; JUSTVEND PRIVAT credited. UPI:509307996753. Call 18002692 for dispute. SMS BLOCK 923 to 9275676766.";

const details = parseSms(sms);

if (!details) {
  console.error("Test Failed: Could not parse SMS details.");
  process.exit(1);
}

console.assert(
  details.bankName === "ICICI Bank",
  "Bank name should be 'ICICI Bank'"
);
console.assert(
  details.transactionType === "debited",
  "Transaction type should be 'debited'"
);
console.assert(details.amount === 40.0, "Amount should be 40.00");
console.assert(details.date === "03-Apr-25", "Date should be '03-Apr-25'");

console.log("All tests passed.");
process.exit(0);
