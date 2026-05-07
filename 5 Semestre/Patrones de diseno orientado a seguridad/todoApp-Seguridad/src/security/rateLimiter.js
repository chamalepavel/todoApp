const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const rateLimitLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.body?.email ?? 'unknown'}`,
  handler: (req, res) => {
    res.status(429).json({ error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' });
  }
});

const rateLimitRegister = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.body?.email ?? 'unknown'}`,
  handler: (req, res) => {
    res.status(429).json({ error: 'Demasiados intentos de registro. Intenta de nuevo en 1 hora.' });
  }
});

module.exports = { rateLimitLogin, rateLimitRegister };
