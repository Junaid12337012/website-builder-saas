const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'textarea', 'number', 'boolean', 'date', 'image', 'url', 'email', 'select', 'multiselect', 'richtext']
  },
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    type: String
  }], // For select/multiselect fields
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    message: String
  }
});

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  fields: [fieldSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    allowPublicRead: {
      type: Boolean,
      default: false
    },
    enableVersioning: {
      type: Boolean,
      default: false
    },
    enableComments: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Create indexes
collectionSchema.index({ user: 1, slug: 1 });
collectionSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
