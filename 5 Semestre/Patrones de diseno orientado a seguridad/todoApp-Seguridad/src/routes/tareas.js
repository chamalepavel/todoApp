const express = require('express');
const router = express.Router();
const Tarea = require('../models/tarea.model');
const validate = require('../middleware/validate');
const { tareaPostSchema, tareaPutSchema } = require('../validators/tarea.validator');
const auth = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimiter');

router.post('/', auth, rateLimiter, validate(tareaPostSchema), async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const tarea = new Tarea({ title, completed, ownerId: req.user.id });
    await tarea.save();
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
      return res.status(403).json({ error: 'Forbidden' });
    }
    await tarea.deleteOne();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
