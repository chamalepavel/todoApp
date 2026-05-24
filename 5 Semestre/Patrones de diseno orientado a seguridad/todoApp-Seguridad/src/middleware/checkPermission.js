const Membership = require('../models/membership.model');

// Busca la membresía del usuario en el proyecto de la tarea.
// Si no tiene membresía, devuelve null.
async function getMembership(userId, projectId) {
  return Membership.findOne({ userId, projectId }).lean();
}

// Decide si el usuario puede leer tareas del proyecto.
// Cualquier miembro del proyecto (viewer, developer, project_admin) puede leer.
async function canReadTask(user, task) {
  if (!task.projectId) return false;
  const membership = await getMembership(user.id, task.projectId);
  return membership !== null;
}

// Decide si el usuario puede editar una tarea específica.
// project_admin: puede editar cualquier tarea del proyecto.
// developer: solo puede editar sus propias tareas.
// viewer: no puede editar nada.
async function canEditTask(user, task) {
  if (!task.projectId) return false;
  const membership = await getMembership(user.id, task.projectId);

  if (!membership) return false;

  if (membership.role === 'project_admin') return true;

  if (membership.role === 'developer') {
    // Solo puede editar si la tarea fue creada por él mismo
    return task.ownerId.toString() === user.id.toString();
  }

  // viewer no puede editar
  return false;
}

// Decide si el usuario puede crear tareas en el proyecto.
// viewer no puede crear. developer y project_admin sí.
async function canCreateTask(user, projectId) {
  const membership = await getMembership(user.id, projectId);

  if (!membership) return false;

  return membership.role === 'developer' || membership.role === 'project_admin';
}

// Middleware listo para usar en rutas GET de tareas del proyecto.
// Verifica que el usuario tenga membresía en el proyecto.
function requireReadPermission(req, res, next) {
  const projectId = req.params.projectId;
  Membership.findOne({ userId: req.user.id, projectId }).lean()
    .then(membership => {
      if (!membership) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      // Guardamos el rol para usarlo en el controlador si hace falta
      req.membership = membership;
      next();
    })
    .catch(next);
}

// Middleware listo para usar en rutas POST de tareas del proyecto.
// Solo developer y project_admin pueden crear tareas.
function requireCreatePermission(req, res, next) {
  const projectId = req.params.projectId;
  Membership.findOne({ userId: req.user.id, projectId }).lean()
    .then(membership => {
      if (!membership || membership.role === 'viewer') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.membership = membership;
      next();
    })
    .catch(next);
}

module.exports = {
  canReadTask,
  canEditTask,
  canCreateTask,
  requireReadPermission,
  requireCreatePermission
};
