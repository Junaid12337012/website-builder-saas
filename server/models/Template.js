const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'business',
      'portfolio',
      'ecommerce',
      'blog',
      'landing',
      'restaurant',
      'agency',
      'education',
      'healthcare',
      'nonprofit',
      'personal',
      'creative'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['page', 'block', 'component'],
    default: 'page'
  },
  thumbnail: {
    type: String,
    required: true
  },
  previewImages: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  // Template structure and content
  structure: {
    elements: [{
      id: String,
      type: String,
      content: mongoose.Schema.Types.Mixed,
      styles: mongoose.Schema.Types.Mixed,
      animations: mongoose.Schema.Types.Mixed,
      responsiveStyles: mongoose.Schema.Types.Mixed,
      children: [String],
      parent: String
    }],
    canvas: {
      backgroundColor: String,
      backgroundImage: String,
      width: Number,
      height: Number,
      padding: String,
      margin: String
    },
    theme: mongoose.Schema.Types.Mixed
  },
  // Template metadata
  isPremium: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedTime: {
    type: String, // e.g., "30 minutes", "2 hours"
    default: '1 hour'
  },
  features: [{
    type: String
  }],
  // Usage statistics
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  // Author information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  // Template versions
  version: {
    type: String,
    default: '1.0.0'
  },
  changelog: [{
    version: String,
    changes: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  // SEO and marketing
  seoTitle: String,
  seoDescription: String,
  keywords: [String],
  // Template requirements
  requiredPlugins: [String],
  compatibleWith: [String],
  // Publishing info
  publishedAt: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
templateSchema.index({ category: 1, type: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ isPremium: 1, isPublic: 1 });
templateSchema.index({ 'rating.average': -1 });
templateSchema.index({ usageCount: -1 });
templateSchema.index({ publishedAt: -1 });
templateSchema.index({ status: 1 });

// Text search index
templateSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  keywords: 'text'
});

// Virtual for average rating
templateSchema.virtual('averageRating').get(function() {
  return this.rating.average;
});

// Method to increment usage count
templateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Method to add rating
templateSchema.methods.addRating = function(rating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + rating) / this.rating.count;
  return this.save();
};

// Static method to find popular templates
templateSchema.statics.findPopular = function(limit = 10) {
  return this.find({ 
    status: 'published', 
    isPublic: true 
  })
  .sort({ usageCount: -1, 'rating.average': -1 })
  .limit(limit);
};

// Static method to find by category
templateSchema.statics.findByCategory = function(category, options = {}) {
  const query = { 
    category, 
    status: 'published', 
    isPublic: true 
  };
  
  if (options.isPremium !== undefined) {
    query.isPremium = options.isPremium;
  }
  
  return this.find(query)
    .sort(options.sort || { publishedAt: -1 })
    .limit(options.limit || 20);
};

// Static method to search templates
templateSchema.statics.searchTemplates = function(searchTerm, filters = {}) {
  const query = {
    status: 'published',
    isPublic: true,
    $text: { $search: searchTerm }
  };
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.isPremium !== undefined) {
    query.isPremium = filters.isPremium;
  }
  
  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, 'rating.average': -1 })
    .limit(filters.limit || 20);
};

// Pre-save middleware
templateSchema.pre('save', function(next) {
  if (this.isModified() && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Template', templateSchema);
