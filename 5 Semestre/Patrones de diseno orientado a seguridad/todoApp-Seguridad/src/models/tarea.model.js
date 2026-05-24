const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  ownerId: { type: String, required: true },
  // projectId indica a qué proyecto pertenece esta tarea.
  // Es opcional para no romper las tareas existentes que no tienen proyecto.
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tarea', tareaSchema);