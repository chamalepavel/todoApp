require('dotenv').config();
const mongoose = require('./config');
const app = require('./app');

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  require('./app').set('trust proxy', 1);
}

// la conexión ya se estableció al requerir './config'
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});

mongoose.connection.on('error', err => console.error(err));