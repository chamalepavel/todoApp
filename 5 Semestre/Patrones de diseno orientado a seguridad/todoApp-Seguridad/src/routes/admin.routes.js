const express = require('express');
const router = express.Router();
const AuditLog = require('../models/auditLog.model');
const auth = require('../middlewares/auth');

// Middleware para verificar que el usuario tenga rol admin.
// Si el token es válido pero el rol no es admin, rechazamos la petición.
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol admin.' });
  }
  next();
}

// Esta ruta devuelve los últimos 100 eventos del audit log.
// Solo los usuarios con rol admin pueden acceder.
// Requiere enviar el JWT en el header Authorization: Bearer <token>
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
