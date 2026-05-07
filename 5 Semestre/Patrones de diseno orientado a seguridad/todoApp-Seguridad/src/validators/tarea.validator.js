const Joi = require('joi');

const titleField = Joi.string()
  .min(1)
  .max(200)
  .regex(/^[^<>]+$/)
  .messages({
    'string.empty': 'El título no puede estar vacío',
    'string.min': 'El título debe tener al menos {#limit} caracter',
    'string.max': 'El título no puede superar los {#limit} caracteres',
    'string.pattern.base': 'No se permite HTML en el título',
    'any.required': 'El título es obligatorio',
  });

const tareaPostSchema = Joi.object({
  title: titleField.required(),
  completed: Joi.boolean(),
});

const tareaPutSchema = Joi.object({
  title: titleField,
  completed: Joi.boolean(),
});

module.exports = { tareaPostSchema, tareaPutSchema };
