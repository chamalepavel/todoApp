// Middleware de error centralizado.
// Registra el detalle completo en el servidor, pero al cliente
// solo le devuelve un mensaje genérico para no filtrar información interna.
const errorHandler = (err, req, res, next) => {
  // Registrar el error completo en el servidor (stack trace incluido)
  console.error(err);

  // CastError de Mongoose: alguien mandó un ID con formato incorrecto
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Cualquier otro error no manejado
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
