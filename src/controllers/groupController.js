const { body, validationResult } = require('express-validator');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Invite = require('../models/Invite');
const crypto = require('crypto');
exports.createGroupValidation = [body('name').notEmpty()];
exports.createGroup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const { name } = req.body;
    const ownerId = req.user.id;
    const group = new Group({ name, ownerId });
    await group.save();
    await GroupMember.create({ groupId: group._id, userId: ownerId });
    res.status(201).json({ message: 'Group created', group });
  } catch (err) { next(err); }
};
exports.deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.ownerId.toString() !== req.user.id) return res.status(403).json({ message: 'Only owner can delete group' });
    await Group.deleteOne({ _id: groupId });
    await GroupMember.deleteMany({ groupId });
    await Invite.deleteMany({ groupId });
    res.json({ message: 'Group deleted' });
  } catch (err) { next(err); }
};
exports.listUserGroups = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const memberships = await GroupMember.find({ userId }).populate('groupId');
    const groups = memberships.map(m => m.groupId);
    res.json({ groups });
  } catch (err) { next(err); }
};
exports.invite = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    const invite = new Invite({ token, groupId, email, invitedBy: req.user.id, expiresAt });
    await invite.save();
    res.json({ message: 'Invite created', token, link: `${process.env.APP_URL || 'http://localhost:5000'}/api/groups/${groupId}/join?token=${token}` });
  } catch (err) { next(err); }
};
exports.join = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { token } = req.body;
    const invite = await Invite.findOne({ token, groupId });
    if (!invite) return res.status(400).json({ message: 'Invalid token' });
    if (invite.used) return res.status(400).json({ message: 'Token already used' });
    if (invite.expiresAt < new Date()) return res.status(400).json({ message: 'Token expired' });
    await GroupMember.create({ groupId, userId: req.user.id });
    invite.used = true;
    await invite.save();
    res.json({ message: 'Joined group' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already a member' });
    next(err);
  }
};
