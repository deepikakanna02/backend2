/**
 * Extracts SMS details from a given message.
 * @param {string} sms - The SMS message text.
 * @returns {Object|null} An object containing bankName, transactionType, amount, and date or null if parsing fails.
 */
function parseSms(sms) {
  const bankRegex   = /([A-Z]+ Bank)/;
  const typeRegex   = /\b(credited|debited)\b/;
  const amountRegex = /Rs\s*([\d,.]+)/;
  const dateRegex   = /on\s+(\d{2}-[A-Za-z]{3}-\d{2})/;

  const bankMatch   = sms.match(bankRegex);
  const typeMatch   = sms.match(typeRegex);
  const amountMatch = sms.match(amountRegex);
  const dateMatch   = sms.match(dateRegex);

  if (!bankMatch || !typeMatch || !amountMatch || !dateMatch) {
    return null;
  }

  return {
    bankName:       bankMatch[1],
    transactionType: typeMatch[1],                // "credited" or "debited"
    amount:         parseFloat(amountMatch[1].replace(/,/g, "")),
    date:           dateMatch[1],                 // e.g. "03-Apr-25"
  };
}

module.exports = { parseSms };
