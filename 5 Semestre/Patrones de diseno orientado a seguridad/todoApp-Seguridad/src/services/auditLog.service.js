const AuditLog = require('../models/auditLog.model');

// Esta función recibe los datos del evento y los guarda en la base de datos.
// El try/catch es importante: si el log falla por alguna razón, no queremos
// que eso corte la respuesta al usuario. El log es secundario.

async function logAuditEvent({ action, actorId, actorEmail, resourceType, resourceId, ip, userAgent, metadata }) {
  try {
    await AuditLog.create({
      action,
      actorId: actorId || null,
      actorEmail: actorEmail || null,
      resourceType: resourceType || null,
      resourceId: resourceId || null,
      ip: ip || null,
      userAgent: userAgent || null,
      metadata: metadata || {},
    });
  } catch (err) {
    // Si guardar el log falla, solo lo mostramos en consola.
    // No lanzamos el error para no interrumpir la operación principal.
    console.error('Error al guardar audit log:', err.message);
  }
}

module.exports = { logAuditEvent };
