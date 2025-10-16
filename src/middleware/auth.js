const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    req.user = { id: decoded.id, email: decoded.email };
    req.userDoc = await User.findById(decoded.id).select('-passwordHash');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
