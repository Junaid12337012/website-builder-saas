const express = require('express');
const Collection = require('../models/Collection');
const Content = require('../models/Content');
const Media = require('../models/Media');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Simple REST-like API endpoints (GraphQL alternative)
router.get('/collections', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      data: {
        collections: collections.map(col => ({
          id: col._id,
          name: col.name,
          slug: col.slug,
          description: col.description,
          fields: col.fields,
          createdAt: col.createdAt,
          updatedAt: col.updatedAt
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ errors: [{ message: error.message }] });
  }
});

router.get('/content/:collectionId', auth, async (req, res) => {
  try {
    const { limit = 10, offset = 0, status } = req.query;
    
    const collection = await Collection.findOne({ 
      _id: req.params.collectionId, 
      user: req.user.id 
    });
    
    if (!collection) {
      return res.status(404).json({ errors: [{ message: 'Collection not found' }] });
    }
    
    const query = { collection: req.params.collectionId };
    if (status) query.status = status;
    
    const content = await Content.find(query)
      .populate('collection')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });
    
    res.json({
      data: {
        content: content.map(item => ({
          id: item._id,
          title: item.title,
          slug: item.slug,
          data: item.data,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ errors: [{ message: error.message }] });
  }
});

module.exports = () => router;
