// middleware that ensures the user is authenticated

const jwt = require('jsonwebtoken');

module.exports = function ensureAuthenticated(req, res, next) {
  const token = req.header('x-auth-token');
  // check for token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // add user from payload
    req.user = decoded;
    next();
    return;
  } catch (err) {
    return res.status(400).json({ msg: 'Token is not valid' });
  }
};
