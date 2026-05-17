const express = require('express');
const router = express.Router();
const Tarea = require('../models/tarea.model');
const validate = require('../middleware/validate');
const { tareaPostSchema, tareaPutSchema } = require('../validators/tarea.validator');
const auth = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimiter');
const { logAuditEvent } = require('../services/auditLog.service');
const AUDIT_ACTIONS = require('../constants/auditActions');

router.post('/', auth, rateLimiter, validate(tareaPostSchema), async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const tarea = new Tarea({ title, completed, ownerId: req.user.id });
    await tarea.save();

    // Registramos que el usuario creó una tarea nueva
    await logAuditEvent({
      action: AUDIT_ACTIONS.TAREA_CREATED,
      actorId: req.user.id,
      actorEmail: req.user.email,
      resourceType: 'tarea',
      resourceId: tarea._id.toString(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { title: tarea.title },
    });

    return res.status(201).json(tarea);
  } catch (err) {
    next(err);
  }
});

router.get('/', auth, rateLimiter, async (req, res, next) => {
  try {
    const tareas = await Tarea.find().lean();
    return res.json(tareas);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', auth, rateLimiter, async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.id).lean();
    if (!tarea) return res.status(404).json({ error: 'Not found' });
    return res.json(tarea);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, rateLimiter, validate(tareaPutSchema), async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) return res.status(404).json({ error: 'Not found' });

    if (tarea.ownerId !== req.user.id) {
      // El usuario intentó modificar una tarea que no le pertenece
      await logAuditEvent({
        action: AUDIT_ACTIONS.FORBIDDEN_ACCESS,
        actorId: req.user.id,
        actorEmail: req.user.email,
        resourceType: 'tarea',
        resourceId: req.params.id,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { accion: 'PUT', mensaje: 'Intentó modificar una tarea ajena' },
      });

      return res.status(403).json({ error: 'Forbidden' });
    }

    tarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true, runValidators: true }
    );
    return res.json(tarea);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, rateLimiter, async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return res.status(404).json({ error: 'Not found' });

    if (tarea.ownerId !== req.user.id) {
      // El usuario intentó borrar una tarea que no le pertenece
      await logAuditEvent({
        action: AUDIT_ACTIONS.FORBIDDEN_ACCESS,
        actorId: req.user.id,
        actorEmail: req.user.email,
        resourceType: 'tarea',
        resourceId: req.params.id,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { accion: 'DELETE', mensaje: 'Intentó eliminar una tarea ajena' },
      });

      return res.status(403).json({ error: 'Forbidden' });
    }

    await tarea.deleteOne();

    // Registramos que se eliminó una tarea correctamente
    await logAuditEvent({
      action: AUDIT_ACTIONS.TAREA_DELETED,
      actorId: req.user.id,
      actorEmail: req.user.email,
      resourceType: 'tarea',
      resourceId: req.params.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { title: tarea.title },
    });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
