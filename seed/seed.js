/*
Simple seed script to create users and a group for testing.
Run: npm run seed
*/
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const User = require('../src/models/User');
const Group = require('../src/models/Group');
const GroupMember = require('../src/models/GroupMember');

(async () => {
  try {
    await connectDB();
    // clear
    await User.deleteMany({});
    await Group.deleteMany({});
    await GroupMember.deleteMany({});

    const u1 = new User({ email: 'alice@example.com', passwordHash: '$2b$10$abcdefghijklmnopqrstuv' });
    const u2 = new User({ email: 'bob@example.com', passwordHash: '$2b$10$abcdefghijklmnopqrstuv' });
    await u1.save(); await u2.save();

    const g = new Group({ name: 'Trip to Goa', ownerId: u1._id });
    await g.save();
    await GroupMember.create({ groupId: g._id, userId: u1._id });
    await GroupMember.create({ groupId: g._id, userId: u2._id });

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
