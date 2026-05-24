const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tarea = require('../models/tarea.model');
const Membership = require('../models/membership.model');
const auth = require('../middlewares/auth');
const { requireReadPermission, requireCreatePermission, canEditTask } = require('../middleware/checkPermission');

// Ruta para crear un proyecto de prueba.
// En un proyecto real esto tendría su propio modelo y validaciones.
// Aquí usamos un ObjectId generado para simular un proyecto.
router.post('/', auth, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    // Generamos un ID que representa el proyecto
    const projectId = new mongoose.Types.ObjectId();
    return res.status(201).json({ projectId, name });
  } catch (err) {
    next(err);
  }
});

// Ruta para agregar un miembro a un proyecto con un rol específico.
// Útil para crear las membresías de prueba.
router.post('/:projectId/members', auth, async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const { projectId } = req.params;

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }

    // Crea la membresía. Si ya existe para ese usuario+proyecto, da error de duplicado.
    const membership = await Membership.create({ userId, projectId, role });
    return res.status(201).json(membership);
  } catch (err) {
    // Código 11000 es el error de MongoDB cuando se viola un índice único
    if (err.code === 11000) {
      return res.status(409).json({ error: 'User already has a membership in this project' });
    }
    next(err);
  }
});

// GET /api/projects/:projectId/tasks
// Devuelve todas las tareas del proyecto.
// Solo pueden acceder usuarios con membresía (viewer, developer, project_admin).
router.get('/:projectId/tasks', auth, requireReadPermission, async (req, res, next) => {
  try {
    const tareas = await Tarea.find({ projectId: req.params.projectId }).lean();
    return res.json(tareas);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/:projectId/tasks
// Crea una tarea dentro del proyecto.
// Solo pueden crear: developer y project_admin. viewer recibe 403.
router.post('/:projectId/tasks', auth, requireCreatePermission, async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const tarea = await Tarea.create({
      title,
      completed: completed || false,
      ownerId: req.user.id,
      projectId: req.params.projectId
    });

    return res.status(201).json(tarea);
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:projectId/tasks/:taskId
// Edita una tarea del proyecto.
// project_admin puede editar cualquier tarea.
// developer solo puede editar sus propias tareas.
// viewer no puede editar nada.
router.put('/:projectId/tasks/:taskId', auth, async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.taskId);
    if (!tarea) return res.status(404).json({ error: 'Not found' });

    // Verificamos el permiso usando la función ABAC
    const allowed = await canEditTask(req.user, tarea);
    if (!allowed) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, completed } = req.body;
    const updated = await Tarea.findByIdAndUpdate(
      req.params.taskId,
      { title, completed },
      { new: true, runValidators: true }
    );

    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
