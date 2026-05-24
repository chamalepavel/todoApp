const mongoose = require('mongoose');

// Una membresía conecta a un usuario con un proyecto y le asigna un rol dentro de ese proyecto.
// Los roles posibles son: project_admin, developer, viewer.
const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  role: {
    type: String,
    enum: ['project_admin', 'developer', 'viewer'],
    required: true
  }
}, { timestamps: true });

// Índice compuesto único: un usuario solo puede tener una membresía por proyecto.
membershipSchema.index({ userId: 1, projectId: 1 }, { unique: true });

module.exports = mongoose.model('Membership', membershipSchema);
