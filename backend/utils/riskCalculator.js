
const Invoice = require("../models/Invoice");

async function calculateClientFeatures(clientName, userId) {
  const invoices = await Invoice.find({
    user: userId,
    "billTo.clientName": clientName,
  });

  const totalInvoices = invoices.length;

  let lateCount = 0;
  let unpaidCount = 0;
  let totalDelay = 0;

  invoices.forEach((inv) => {
    if (inv.status !== "Paid") {
      unpaidCount++;
    }

    if (inv.status === "Paid" && inv.paidAt && inv.dueDate) {
      const delay =
        (new Date(inv.paidAt) - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24);

      if (delay > 0) {
        lateCount++;
        totalDelay += delay;
      }
    }
  });

  const avgDelay = lateCount > 0 ? totalDelay / lateCount : 0;

  const isNewClient = totalInvoices <= 1 ? 1 : 0;

  return {
    totalInvoices,
    lateCount,
    unpaidCount,
    avgDelay,
    isNewClient,
  };
}

module.exports = calculateClientFeatures;
