const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Template = require('../models/Template');

// Get all templates with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      type,
      isPremium,
      difficulty,
      search,
      sort = 'newest'
    } = req.query;

    let query = {
      status: 'published',
      isPublic: true
    };

    // Apply filters
    if (category) query.category = category;
    if (type) query.type = type;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    if (difficulty) query.difficulty = difficulty;

    let sortOptions = {};
    switch (sort) {
      case 'popular':
        sortOptions = { usageCount: -1, 'rating.average': -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1, usageCount: -1 };
        break;
      case 'oldest':
        sortOptions = { publishedAt: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { publishedAt: -1 };
        break;
    }

    let templates;
    let total;

    if (search) {
      // Text search
      query.$text = { $search: search };
      templates = await Template.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' }, ...sortOptions })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('author', 'name avatar');
      
      total = await Template.countDocuments(query);
    } else {
      // Regular query
      templates = await Template.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('author', 'name avatar');
      
      total = await Template.countDocuments(query);
    }

    res.json({
      templates,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get template categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Template.aggregate([
      { $match: { status: 'published', isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(categories.map(cat => ({
      name: cat._id,
      count: cat.count
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular templates
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const templates = await Template.findPopular(parseInt(limit))
      .populate('author', 'name avatar');
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get templates by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, isPremium } = req.query;
    
    const options = { limit: parseInt(limit) };
    if (isPremium !== undefined) {
      options.isPremium = isPremium === 'true';
    }
    
    const templates = await Template.findByCategory(category, options)
      .populate('author', 'name avatar');
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single template by ID
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      status: 'published',
      isPublic: true
    }).populate('author', 'name avatar email');

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Use template (increment usage count)
router.post('/:id/use', auth, async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      status: 'published',
      isPublic: true
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await template.incrementUsage();
    
    res.json({ 
      message: 'Template usage recorded',
      template: {
        id: template._id,
        name: template.name,
        structure: template.structure
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rate template
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const template = await Template.findOne({
      _id: req.params.id,
      status: 'published',
      isPublic: true
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await template.addRating(rating);
    
    res.json({ 
      message: 'Rating added successfully',
      averageRating: template.rating.average,
      totalRatings: template.rating.count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new template (authenticated users only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      type = 'page',
      thumbnail,
      previewImages = [],
      tags = [],
      structure,
      isPremium = false,
      difficulty = 'beginner',
      estimatedTime = '1 hour',
      features = [],
      seoTitle,
      seoDescription,
      keywords = []
    } = req.body;

    const template = new Template({
      name,
      description,
      category,
      type,
      thumbnail,
      previewImages,
      tags,
      structure,
      isPremium,
      difficulty,
      estimatedTime,
      features,
      seoTitle,
      seoDescription,
      keywords,
      author: req.user.id,
      authorName: req.user.name,
      status: 'draft'
    });

    await template.save();
    
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update template (author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found or unauthorized' });
    }

    const allowedUpdates = [
      'name', 'description', 'category', 'type', 'thumbnail', 'previewImages',
      'tags', 'structure', 'isPremium', 'difficulty', 'estimatedTime',
      'features', 'seoTitle', 'seoDescription', 'keywords', 'status'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        template[field] = req.body[field];
      }
    });

    await template.save();
    
    res.json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete template (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found or unauthorized' });
    }

    await Template.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's templates
router.get('/user/my-templates', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = { author: req.user.id };
    if (status) query.status = status;

    const templates = await Template.find(query)
      .sort({ lastUpdated: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Template.countDocuments(query);

    res.json({
      templates,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
