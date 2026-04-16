const jwt = require('jsonwebtoken');

const refreshTokenStore = new Map();

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  refreshTokenStore.set(token, user._id.toString());
  return token;
}

function refreshAccessToken(refreshToken) {
  if (!refreshTokenStore.has(refreshToken)) {
    throw new Error('Invalid or revoked refresh token');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    refreshTokenStore.delete(refreshToken);
    throw new Error('Invalid or revoked refresh token');
  }

  refreshTokenStore.delete(refreshToken);

  const user = { _id: payload.id, email: payload.email, role: payload.role };
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

function revokeRefreshToken(refreshToken) {
  refreshTokenStore.delete(refreshToken);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  revokeRefreshToken
};
