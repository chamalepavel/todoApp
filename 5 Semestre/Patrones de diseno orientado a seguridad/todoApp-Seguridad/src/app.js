const express = require('express');
const tareasRouter = require('./routes/tareas');
const authRouter = require('./routes/auth');
const securityHeaders = require('./middlewares/securityHeaders');
const corsConfig = require('./config/cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(securityHeaders);
app.use(corsConfig);
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/tareas', tareasRouter);

app.get('/', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

module.exports = app;