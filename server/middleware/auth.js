const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user owns the project
const projectOwner = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.user._id.toString()) {
      // Check if user is a collaborator with edit permissions
      const collaborator = project.collaborators.find(
        collab => collab.user.toString() === req.user._id.toString() && 
        ['editor', 'admin'].includes(collab.role)
      );
      
      if (!collaborator) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check subscription limits
const checkSubscriptionLimits = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const userProjectCount = await Project.countDocuments({ owner: req.user._id });
    
    const limits = {
      free: 3,
      pro: 50,
      enterprise: Infinity
    };
    
    const userLimit = limits[req.user.subscription.plan];
    
    if (userProjectCount >= userLimit) {
      return res.status(403).json({ 
        message: 'Project limit reached for your subscription plan',
        currentCount: userProjectCount,
        limit: userLimit,
        plan: req.user.subscription.plan
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  auth,
  projectOwner,
  checkSubscriptionLimits
};
