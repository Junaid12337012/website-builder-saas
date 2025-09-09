const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Collection = require('../models/Collection');
const { auth } = require('../middleware/auth');

// Get all content for a collection
router.get('/collection/:collectionId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Verify collection belongs to user
    const collection = await Collection.findOne({
      _id: req.params.collectionId,
      user: req.user.id
    });
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    const query = { collection: req.params.collectionId };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    
    const content = await Content.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Content.countDocuments(query);
    
    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single content item
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('collection')
      .populate('user', 'name email');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if user owns the content or collection
    if (content.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new content
router.post('/', auth, async (req, res) => {
  try {
    const { title, collectionId, data, status = 'draft', seo } = req.body;
    
    // Verify collection belongs to user
    const collection = await Collection.findOne({
      _id: collectionId,
      user: req.user.id
    });
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    // Generate slug from title
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Ensure unique slug within collection
    let counter = 1;
    let originalSlug = slug;
    while (await Content.findOne({ collection: collectionId, slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
    
    // Validate data against collection fields
    const validationErrors = validateContentData(data, collection.fields);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    const content = new Content({
      title,
      slug,
      collection: collectionId,
      data,
      status,
      user: req.user.id,
      seo: seo || {}
    });
    
    await content.save();
    await content.populate('collection');
    
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update content
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, data, status, seo } = req.body;
    
    const content = await Content.findById(req.params.id).populate('collection');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if user owns the content
    if (content.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update slug if title changed
    if (title && title !== content.title) {
      let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Ensure unique slug within collection
      let counter = 1;
      let originalSlug = slug;
      while (await Content.findOne({ 
        collection: content.collection._id, 
        slug, 
        _id: { $ne: req.params.id } 
      })) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      
      content.slug = slug;
    }
    
    // Validate data if provided
    if (data) {
      const validationErrors = validateContentData(data, content.collection.fields);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationErrors 
        });
      }
    }
    
    if (title) content.title = title;
    if (data) content.data = data;
    if (status) content.status = status;
    if (seo) content.seo = { ...content.seo, ...seo };
    
    // Increment version for published content
    if (status === 'published' && content.status !== 'published') {
      content.version += 1;
    }
    
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete content
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if user owns the content
    if (content.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Publish/Unpublish content
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    const { publish } = req.body;
    
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if user owns the content
    if (content.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    content.status = publish ? 'published' : 'draft';
    if (publish) {
      content.publishedAt = new Date();
      content.version += 1;
    }
    
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get public content (for website rendering)
router.get('/public/:collectionSlug/:contentSlug', async (req, res) => {
  try {
    const { collectionSlug, contentSlug } = req.params;
    
    const collection = await Collection.findOne({ slug: collectionSlug });
    if (!collection || !collection.settings.allowPublicRead) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    const content = await Content.findOne({
      collection: collection._id,
      slug: contentSlug,
      status: 'published'
    }).populate('collection');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Increment view count
    content.metadata.views += 1;
    await content.save();
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validation helper function
function validateContentData(data, fields) {
  const errors = [];
  
  fields.forEach(field => {
    const value = data[field.name];
    
    // Check required fields
    if (field.required && (!value || value === '')) {
      errors.push(`${field.label} is required`);
      return;
    }
    
    if (value !== undefined && value !== null && value !== '') {
      // Type validation
      switch (field.type) {
        case 'number':
          if (isNaN(value)) {
            errors.push(`${field.label} must be a number`);
          } else {
            const num = Number(value);
            if (field.validation?.min !== undefined && num < field.validation.min) {
              errors.push(`${field.label} must be at least ${field.validation.min}`);
            }
            if (field.validation?.max !== undefined && num > field.validation.max) {
              errors.push(`${field.label} must be at most ${field.validation.max}`);
            }
          }
          break;
          
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field.label} must be a valid email address`);
          }
          break;
          
        case 'url':
          try {
            new URL(value);
          } catch {
            errors.push(`${field.label} must be a valid URL`);
          }
          break;
          
        case 'select':
          if (field.options && !field.options.includes(value)) {
            errors.push(`${field.label} must be one of: ${field.options.join(', ')}`);
          }
          break;
          
        case 'multiselect':
          if (Array.isArray(value) && field.options) {
            const invalidOptions = value.filter(v => !field.options.includes(v));
            if (invalidOptions.length > 0) {
              errors.push(`${field.label} contains invalid options: ${invalidOptions.join(', ')}`);
            }
          }
          break;
      }
      
      // Pattern validation
      if (field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          errors.push(field.validation.message || `${field.label} format is invalid`);
        }
      }
    }
  });
  
  return errors;
}

module.exports = router;
