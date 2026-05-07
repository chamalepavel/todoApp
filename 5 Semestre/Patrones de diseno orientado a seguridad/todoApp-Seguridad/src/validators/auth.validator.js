const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Debe ser un correo electrónico válido',
    'any.required': 'El correo es obligatorio',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
    'string.max': 'La contraseña no puede superar los {#limit} caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Debe ser un correo electrónico válido',
    'any.required': 'El correo es obligatorio',
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es obligatoria',
  }),
});

module.exports = { registerSchema, loginSchema };
