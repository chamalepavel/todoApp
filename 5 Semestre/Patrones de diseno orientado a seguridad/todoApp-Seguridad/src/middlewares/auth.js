const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token = header.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
