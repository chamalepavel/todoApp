const express = require('express');
const router = express.Router();
const AuditLog = require('../models/auditLog.model');
const auth = require('../middlewares/auth');

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol admin.' });
  }
  next();
}

router.get('/audit-logs', auth, requireAdmin, async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json(logs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
