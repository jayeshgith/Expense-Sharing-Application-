const { body, validationResult } = require('express-validator');
const Settlement = require('../models/Settlement');
const GroupMember = require('../models/GroupMember');
const mongoose = require('mongoose');
const { incPair } = require('../services/balanceService');
exports.createSettlementValidation = [ body('payerId').notEmpty(), body('payeeId').notEmpty(), body('amount').isFloat({ gt: 0 }) ];
exports.createSettlement = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { await session.abortTransaction(); session.endSession(); return res.status(422).json({ errors: errors.array() }); }
    const { groupId } = req.params;
    const { payerId, payeeId, amount, date } = req.body;
    const m1 = await GroupMember.findOne({ groupId, userId: payerId });
    const m2 = await GroupMember.findOne({ groupId, userId: payeeId });
    if (!m1 || !m2) { await session.abortTransaction(); session.endSession(); return res.status(400).json({ message: 'Payer or payee not a group member' }); }
    const settlement = new Settlement({ groupId, payerId, payeeId, amount, date: date || Date.now() });
    await settlement.save({ session });
    await incPair(groupId, payerId, payeeId, -amount, session);
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: 'Settlement recorded', settlement });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
exports.getGroupBalances = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const Balance = require('../models/Balance');
    const b = await Balance.findOne({ groupId }).populate('entries.from entries.to', 'email');
    const readable = (b && b.entries) ? b.entries.map(e => ({ from: e.from.email, to: e.to.email, amount: e.amount })) : [];
    res.json({ balances: readable });
  } catch (err) { next(err); }
};
exports.listUserSettlements = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const settlements = await Settlement.find({ $or: [{ payerId: userId }, { payeeId: userId }] }).populate('payerId payeeId', 'email');
    res.json({ settlements });
  } catch (err) { next(err); }
};
