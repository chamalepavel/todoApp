const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'test_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

const app = require('../../src/app');
const User = require('../../src/models/user.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

const usuario = { email: 'test@test.com', password: 'Test1234!' };

test('login devuelve accessToken y refreshToken', async () => {
  await request(app).post('/api/auth/register').send(usuario);
  const res = await request(app).post('/api/auth/login').send(usuario);

  expect(res.statusCode).toBe(200);
  expect(res.body.accessToken).toBeDefined();
  expect(res.body.refreshToken).toBeDefined();
  expect(res.body.user.email).toBe(usuario.email);
});

test('access token permite acceder a tareas', async () => {
  await request(app).post('/api/auth/register').send(usuario);
  const login = await request(app).post('/api/auth/login').send(usuario);
  const { accessToken } = login.body;

  const res = await request(app)
    .get('/api/tareas')
    .set('Authorization', `Bearer ${accessToken}`);

  expect(res.statusCode).toBe(200);
});

test('refresh genera nuevos tokens', async () => {
  await request(app).post('/api/auth/register').send(usuario);
  const login = await request(app).post('/api/auth/login').send(usuario);
  const { refreshToken } = login.body;

  const res = await request(app)
    .post('/api/auth/refresh')
    .send({ refreshToken });

  expect(res.statusCode).toBe(200);
  expect(res.body.accessToken).toBeDefined();
  expect(res.body.refreshToken).toBeDefined();
  expect(res.body.refreshToken).not.toBe(refreshToken);
});

test('refresh token viejo es rechazado despues de rotar', async () => {
  await request(app).post('/api/auth/register').send(usuario);
  const login = await request(app).post('/api/auth/login').send(usuario);
  const refreshTokenViejo = login.body.refreshToken;

  await request(app).post('/api/auth/refresh').send({ refreshToken: refreshTokenViejo });

  const res = await request(app)
    .post('/api/auth/refresh')
    .send({ refreshToken: refreshTokenViejo });

  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBe('Invalid or revoked refresh token');
});

test('logout invalida el refresh token', async () => {
  await request(app).post('/api/auth/register').send(usuario);
  const login = await request(app).post('/api/auth/login').send(usuario);
  const { refreshToken } = login.body;

  const logout = await request(app).post('/api/auth/logout').send({ refreshToken });
  expect(logout.body.message).toBe('Logged out successfully');

  const res = await request(app).post('/api/auth/refresh').send({ refreshToken });
  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBe('Invalid or revoked refresh token');
});
