// Aquí guardamos los nombres de las acciones que queremos registrar en el audit log.
// Usamos constantes para no escribir strings a mano en cada archivo y evitar errores de tipeo.

const AUDIT_ACTIONS = {
  USER_REGISTER: 'USER_REGISTER',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  FORBIDDEN_ACCESS: 'FORBIDDEN_ACCESS',
  TAREA_CREATED: 'TAREA_CREATED',
  TAREA_DELETED: 'TAREA_DELETED',
};

module.exports = AUDIT_ACTIONS;
