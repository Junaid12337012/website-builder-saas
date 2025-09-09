const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Content = require('../models/Content');
const { auth } = require('../middleware/auth');

// Get all collections for user
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single collection
router.get('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new collection
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, fields } = req.body;
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if collection with this slug already exists for user
    const existingCollection = await Collection.findOne({
      user: req.user.id,
      slug
    });
    
    if (existingCollection) {
      return res.status(400).json({ message: 'Collection with this name already exists' });
    }
    
    const collection = new Collection({
      name,
      slug,
      description,
      fields: fields || [],
      user: req.user.id
    });
    
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update collection
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, fields, settings } = req.body;
    
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    // Update slug if name changed
    if (name && name !== collection.name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Check if new slug conflicts
      const existingCollection = await Collection.findOne({
        user: req.user.id,
        slug,
        _id: { $ne: req.params.id }
      });
      
      if (existingCollection) {
        return res.status(400).json({ message: 'Collection with this name already exists' });
      }
      
      collection.slug = slug;
    }
    
    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (fields) collection.fields = fields;
    if (settings) collection.settings = { ...collection.settings, ...settings };
    
    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    // Delete all content in this collection
    await Content.deleteMany({ collection: req.params.id });
    
    // Delete the collection
    await Collection.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get collection statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    const totalContent = await Content.countDocuments({ collection: req.params.id });
    const publishedContent = await Content.countDocuments({ 
      collection: req.params.id, 
      status: 'published' 
    });
    const draftContent = await Content.countDocuments({ 
      collection: req.params.id, 
      status: 'draft' 
    });
    
    res.json({
      total: totalContent,
      published: publishedContent,
      draft: draftContent,
      archived: totalContent - publishedContent - draftContent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
