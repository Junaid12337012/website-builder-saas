const mongoose = require('mongoose');

// Schema for individual elements on the canvas
const elementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'button', 'section', 'container']
  },
  content: {
    text: String,
    src: String,
    alt: String,
    href: String,
    placeholder: String
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  dimensions: {
    width: { type: Number, default: 100 },
    height: { type: Number, default: 50 }
  },
  styles: {
    backgroundColor: String,
    color: String,
    fontSize: String,
    fontFamily: String,
    fontWeight: String,
    textAlign: String,
    padding: String,
    margin: String,
    border: String,
    borderRadius: String,
    boxShadow: String,
    opacity: Number,
    transform: String
  },
  children: [String], // Array of child element IDs
  parent: String // Parent element ID
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  elements: [elementSchema],
  canvas: {
    width: {
      type: Number,
      default: 1200
    },
    height: {
      type: Number,
      default: 800
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    backgroundImage: String,
    gridSize: {
      type: Number,
      default: 10
    },
    snapToGrid: {
      type: Boolean,
      default: true
    }
  },
  settings: {
    responsive: {
      type: Boolean,
      default: true
    },
    seo: {
      title: String,
      description: String,
      keywords: [String]
    },
    customCSS: String,
    customJS: String
  },
  history: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    data: mongoose.Schema.Types.Mixed
  }],
  published: {
    isPublished: {
      type: Boolean,
      default: false
    },
    url: String,
    platform: {
      type: String,
      enum: ['netlify', 'vercel', 'custom']
    },
    publishedAt: Date,
    lastPublishedAt: Date
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  isTemplate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ tags: 1 });
projectSchema.index({ 'published.isPublished': 1 });

// Virtual for element count
projectSchema.virtual('elementCount').get(function() {
  return this.elements.length;
});

// Method to add element to history
projectSchema.methods.addToHistory = function(action, data) {
  this.history.push({
    action,
    data,
    timestamp: new Date()
  });
  
  // Keep only last 50 history entries
  if (this.history.length > 50) {
    this.history = this.history.slice(-50);
  }
};

// Method to generate thumbnail
projectSchema.methods.generateThumbnail = function() {
  // This would integrate with a screenshot service
  // For now, return a placeholder
  return `https://via.placeholder.com/300x200/f0f0f0/666666?text=${encodeURIComponent(this.name)}`;
};

module.exports = mongoose.model('Project', projectSchema);
