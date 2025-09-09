const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  parentVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: [{
      author: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }
}, {
  timestamps: true
});

// Create compound unique index for slug within collection
contentSchema.index({ collection: 1, slug: 1 }, { unique: true });
contentSchema.index({ user: 1, status: 1 });
contentSchema.index({ collection: 1, status: 1, publishedAt: -1 });

// Pre-save middleware to set publishedAt when status changes to published
contentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Content', contentSchema);
