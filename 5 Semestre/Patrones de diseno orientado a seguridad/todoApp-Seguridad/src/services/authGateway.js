const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const tokenService = require('./tokenService');

async function register(email, password) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  const accessToken = tokenService.generateAccessToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);
  return { accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role } };
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const accessToken = tokenService.generateAccessToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);
  return { accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role } };
}

module.exports = { register, login };
