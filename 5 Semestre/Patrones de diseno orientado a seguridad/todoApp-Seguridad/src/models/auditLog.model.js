const mongoose = require('mongoose');

// Este modelo representa un evento de auditoría guardado en la base de datos.
// Cada vez que pasa algo importante en el sistema (login, error 403, etc.) se guarda un documento aquí.

const auditLogSchema = new mongoose.Schema({
  // La acción que ocurrió, por ejemplo LOGIN_SUCCESS o FORBIDDEN_ACCESS
  action: {
    type: String,
    required: true,
  },

  // El id del usuario que hizo la acción. Puede ser null si no estaba autenticado.
  actorId: {
    type: String,
    default: null,
  },

  // El email del usuario que hizo la acción. Nos ayuda a identificarlo sin buscar en otra colección.
  actorEmail: {
    type: String,
    default: null,
  },

  // El tipo de recurso que se vio afectado, por ejemplo "tarea" o "usuario"
  resourceType: {
    type: String,
    default: null,
  },

  // El id del recurso afectado, por ejemplo el id de la tarea que se borró
  resourceId: {
    type: String,
    default: null,
  },

  // La dirección IP desde donde vino la solicitud
  ip: {
    type: String,
    default: null,
  },

  // El user agent del cliente que hizo la solicitud (navegador, Postman, etc.)
  userAgent: {
    type: String,
    default: null,
  },

  // Información extra que queramos guardar, por ejemplo la razón de un error
  // Es un objeto libre para no limitar qué podemos guardar
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  // timestamps agrega automáticamente createdAt y updatedAt al documento
  timestamps: true,
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
