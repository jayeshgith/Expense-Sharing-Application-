const Balance = require('../models/Balance');
const mongoose = require('mongoose');
async function getBalanceDoc(groupId, session = null) {
  let b = await Balance.findOne({ groupId }).session(session);
  if (!b) {
    b = new Balance({ groupId, entries: [] });
    await b.save({ session });
  }
  return b;
}
async function incPair(groupId, fromId, toId, amount, session = null) {
  const b = await getBalanceDoc(groupId, session);
  const idx = b.entries.findIndex(e => e.from.toString() === fromId.toString() && e.to.toString() === toId.toString());
  if (idx >= 0) {
    b.entries[idx].amount = Number((b.entries[idx].amount + amount).toFixed(2));
  } else {
    b.entries.push({ from: fromId, to: toId, amount: Number(amount.toFixed(2)) });
  }
  b.entries = b.entries.filter(e => Math.abs(e.amount) > 0.005);
  await b.save({ session });
  return b;
}
module.exports = { getBalanceDoc, incPair };
