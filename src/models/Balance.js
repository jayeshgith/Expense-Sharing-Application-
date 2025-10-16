const mongoose = require('mongoose');
const EntrySchema = new mongoose.Schema({ from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, amount: { type: Number, required: true, default: 0 } }, { _id: false });
const BalanceSchema = new mongoose.Schema({ groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, unique: true }, entries: [EntrySchema] });
module.exports = mongoose.model('Balance', BalanceSchema);
