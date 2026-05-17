const AuditLog = require('../models/auditLog.model');

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
    console.error('Error al guardar audit log:', err.message);
  }
}

module.exports = { logAuditEvent };
