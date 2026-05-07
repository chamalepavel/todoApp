const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { allowUnknown: false });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(422).json({ error: messages });
  }

  next();
};

module.exports = validate;
