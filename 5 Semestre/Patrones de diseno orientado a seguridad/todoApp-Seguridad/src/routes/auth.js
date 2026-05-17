const express = require('express');
const router = express.Router();
const authGateway = require('../services/authGateway');
const tokenService = require('../services/tokenService');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { rateLimitLogin, rateLimitRegister } = require('../security/rateLimiter');
const { logAuditEvent } = require('../services/auditLog.service');
const AUDIT_ACTIONS = require('../constants/auditActions');

router.post('/register', rateLimitRegister, validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authGateway.register(email, password);

    // Registramos que un usuario nuevo se registró exitosamente
    await logAuditEvent({
      action: AUDIT_ACTIONS.USER_REGISTER,
      actorId: result.user.id,
      actorEmail: result.user.email,
      resourceType: 'usuario',
      resourceId: result.user.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { email: result.user.email },
    });

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', rateLimitLogin, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authGateway.login(email, password);

    // Registramos el login exitoso
    await logAuditEvent({
      action: AUDIT_ACTIONS.LOGIN_SUCCESS,
      actorId: result.user.id,
      actorEmail: result.user.email,
      resourceType: 'usuario',
      resourceId: result.user.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { email: result.user.email },
    });

    return res.json(result);
  } catch (err) {
    // Si authGateway.login lanza un error, significa que el login falló.
    // Registramos el intento fallido con el email que se usó.
    await logAuditEvent({
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      actorId: null,
      actorEmail: req.body.email,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { email: req.body.email, reason: err.message },
    });

    return res.status(401).json({ error: err.message });
  }
});

router.post('/refresh', (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = tokenService.refreshAccessToken(refreshToken);
    return res.json(tokens);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  tokenService.revokeRefreshToken(refreshToken);

  // Registramos el logout. No tenemos req.user porque esta ruta no pide JWT,
  // pero podemos dejar constancia del evento con la IP.
  await logAuditEvent({
    action: AUDIT_ACTIONS.LOGOUT,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    metadata: {},
  });

  return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
