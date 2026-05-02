const express = require('express');
const router = express.Router();
const authGateway = require('../services/authGateway');
const tokenService = require('../services/tokenService');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authGateway.register(email, password);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authGateway.login(email, password);
    return res.json(result);
  } catch (err) {
    // El error de credenciales inválidas se responde 401 directamente
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

router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  tokenService.revokeRefreshToken(refreshToken);
  return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
