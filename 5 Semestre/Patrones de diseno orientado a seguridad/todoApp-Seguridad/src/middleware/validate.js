// Middleware genérico de validación.
// Recibe un schema de Joi y devuelve un middleware que valida req.body.
// Si el body no cumple el schema, responde 422 con los mensajes de error.
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { allowUnknown: false });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(422).json({ error: messages });
  }

  next();
};

module.exports = validate;
