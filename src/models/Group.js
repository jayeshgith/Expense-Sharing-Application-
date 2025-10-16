const mongoose = require('mongoose');
const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Group', GroupSchema);
