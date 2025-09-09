const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, projectOwner, checkSubscriptionLimits } = require('../middleware/auth');
const { checkSubscriptionLimit, updateUsage } = require('../middleware/subscription');
const Project = require('../models/Project');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = { owner: req.user._id };
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Add status filter
    if (status) {
      query.status = status;
    }
    
    const projects = await Project.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-elements -history') // Exclude heavy fields for list view
      .lean();
    
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', auth, checkSubscriptionLimit('project'), [
  body('name').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, template } = req.body;
    
    const project = new Project({
      name,
      description: description || '',
      owner: req.user._id,
      elements: template ? template.elements : [],
      canvas: template ? template.canvas : {},
      settings: template ? template.settings : {}
    });
    
    // Add initial history entry
    project.addToHistory('project_created', { name });
    
    await project.save();
    
    // Update usage counter
    await updateUsage(req.user._id, 'projects', 1);
    
    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, projectOwner, async (req, res) => {
  try {
    res.json({ project: req.project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, projectOwner, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Project name cannot be empty'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, elements, canvas, settings, tags } = req.body;
    const project = req.project;
    
    // Track what changed for history
    const changes = {};
    
    if (name && name !== project.name) {
      changes.name = { from: project.name, to: name };
      project.name = name;
    }
    
    if (description !== undefined && description !== project.description) {
      changes.description = { from: project.description, to: description };
      project.description = description;
    }
    
    if (elements) {
      changes.elements = { elementCount: elements.length };
      project.elements = elements;
    }
    
    if (canvas) {
      project.canvas = { ...project.canvas, ...canvas };
    }
    
    if (settings) {
      project.settings = { ...project.settings, ...settings };
    }
    
    if (tags) {
      project.tags = tags;
    }
    
    // Add to history if there were changes
    if (Object.keys(changes).length > 0) {
      project.addToHistory('project_updated', changes);
    }
    
    await project.save();
    
    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, projectOwner, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/duplicate
// @desc    Duplicate project
// @access  Private
router.post('/:id/duplicate', auth, projectOwner, checkSubscriptionLimit('project'), async (req, res) => {
  try {
    const originalProject = req.project;
    
    const duplicatedProject = new Project({
      name: `${originalProject.name} (Copy)`,
      description: originalProject.description,
      owner: req.user._id,
      elements: originalProject.elements,
      canvas: originalProject.canvas,
      settings: originalProject.settings,
      tags: originalProject.tags
    });
    
    duplicatedProject.addToHistory('project_duplicated', { 
      originalId: originalProject._id,
      originalName: originalProject.name 
    });
    
    await duplicatedProject.save();
    
    // Update usage counter
    await updateUsage(req.user._id, 'projects', 1);
    
    res.status(201).json({
      message: 'Project duplicated successfully',
      project: duplicatedProject
    });
  } catch (error) {
    console.error('Duplicate project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id/elements
// @desc    Update project elements (for real-time editor updates)
// @access  Private
router.put('/:id/elements', auth, projectOwner, async (req, res) => {
  try {
    const { elements, action } = req.body;
    const project = req.project;
    
    project.elements = elements;
    project.addToHistory(action || 'elements_updated', { 
      elementCount: elements.length,
      timestamp: new Date()
    });
    
    await project.save();
    
    res.json({
      message: 'Elements updated successfully',
      elementCount: elements.length
    });
  } catch (error) {
    console.error('Update elements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id/history
// @desc    Get project history
// @access  Private
router.get('/:id/history', auth, projectOwner, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const project = req.project;
    
    const history = project.history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));
    
    res.json({ history });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/collaborators
// @desc    Add collaborator to project
// @access  Private
router.post('/:id/collaborators', auth, projectOwner, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('role').isIn(['viewer', 'editor', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, role } = req.body;
    const project = req.project;
    
    // Find user by email
    const User = require('../models/User');
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already a collaborator
    const existingCollaborator = project.collaborators.find(
      collab => collab.user.toString() === user._id.toString()
    );
    
    if (existingCollaborator) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }
    
    project.collaborators.push({
      user: user._id,
      role
    });
    
    project.addToHistory('collaborator_added', { 
      email, 
      role,
      addedBy: req.user.email 
    });
    
    await project.save();
    
    res.json({
      message: 'Collaborator added successfully',
      collaborator: { user: user.toJSON(), role }
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
