const mongoose = require('mongoose');
const GroupMemberSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now }
});
GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('GroupMember', GroupMemberSchema);
