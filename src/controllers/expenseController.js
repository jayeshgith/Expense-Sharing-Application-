const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const GroupMember = require('../models/GroupMember');
const mongoose = require('mongoose');
const { incPair } = require('../services/balanceService');
exports.createExpenseValidation = [ body('title').notEmpty(), body('amount').isFloat({ gt: 0 }), body('payerId').notEmpty(), body('participants').isArray({ min: 1 }) ];
exports.createExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { await session.abortTransaction(); session.endSession(); return res.status(422).json({ errors: errors.array() }); }
    const { groupId } = req.params;
    const { title, amount, date, payerId, participants } = req.body;
    const isMember = await GroupMember.findOne({ groupId, userId: req.user.id });
    if (!isMember) { await session.abortTransaction(); session.endSession(); return res.status(403).json({ message: 'Not a group member' }); }
    const perShare = Number((amount / participants.length).toFixed(2));
    const remainder = Number((amount - perShare * participants.length).toFixed(2));
    const sharePerUser = participants.map((u, idx) => ({ userId: u, share: perShare + (idx === 0 ? remainder : 0) }));
    const expense = new Expense({ groupId, title, amount, date: date || Date.now(), payerId, participants, sharePerUser });
    await expense.save({ session });
    for (const sp of sharePerUser) {
      if (sp.userId.toString() === payerId.toString()) continue;
      await incPair(groupId, sp.userId, payerId, sp.share, session);
    }
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: 'Expense created', expense });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
exports.listExpenses = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const expenses = await Expense.find({ groupId }).populate('payerId', 'email').populate('sharePerUser.userId', 'email');
    res.json({ expenses });
  } catch (err) { next(err); }
};
