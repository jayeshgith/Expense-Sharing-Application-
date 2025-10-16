const mongoose = require('mongoose');
const InviteSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  email: { type: String, required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Invite', InviteSchema);
