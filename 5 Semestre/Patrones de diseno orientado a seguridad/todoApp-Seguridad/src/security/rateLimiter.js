const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { logAuditEvent } = require('../services/auditLog.service');
const AUDIT_ACTIONS = require('../constants/auditActions');

const rateLimitLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.body?.email ?? 'unknown'}`,
  handler: async (req, res) => {
    // Alguien superó el límite de intentos de login, lo registramos
    await logAuditEvent({
      action: AUDIT_ACTIONS.RATE_LIMIT_EXCEEDED,
      actorEmail: req.body?.email || null,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {
        ruta: req.path,
        email: req.body?.email || null,
        mensaje: 'Límite de intentos de login superado',
      },
    });

    res.status(429).json({ error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' });
  },
});

const rateLimitRegister = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.body?.email ?? 'unknown'}`,
  handler: async (req, res) => {
    // Alguien superó el límite de intentos de registro, lo registramos
    await logAuditEvent({
      action: AUDIT_ACTIONS.RATE_LIMIT_EXCEEDED,
      actorEmail: req.body?.email || null,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {
        ruta: req.path,
        email: req.body?.email || null,
        mensaje: 'Límite de intentos de registro superado',
      },
    });

    res.status(429).json({ error: 'Demasiados intentos de registro. Intenta de nuevo en 1 hora.' });
  },
});

module.exports = { rateLimitLogin, rateLimitRegister };
