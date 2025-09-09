const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folder: {
    type: String,
    default: 'uploads'
  },
  tags: [{
    type: String
  }],
  metadata: {
    width: Number,
    height: Number,
    exif: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Create indexes
mediaSchema.index({ user: 1, createdAt: -1 });
mediaSchema.index({ user: 1, mimeType: 1 });
mediaSchema.index({ user: 1, tags: 1 });

module.exports = mongoose.model('Media', mediaSchema);
