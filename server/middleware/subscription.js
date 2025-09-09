const Subscription = require('../models/Subscription');
const { STRIPE_PLANS } = require('../config/stripe');

// Middleware to check subscription limits
const checkSubscriptionLimit = (feature) => {
  return async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne({ user: req.user.id });
      
      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: 'No subscription found',
          upgrade: true
        });
      }

      let canAccess = false;
      let message = '';

      switch (feature) {
        case 'project':
          canAccess = subscription.canCreateProject();
          message = `Project limit reached. Upgrade to create more projects. Current: ${subscription.usage.projects}/${subscription.limits.projects}`;
          break;
        
        case 'customDomain':
          canAccess = subscription.canUseCustomDomain();
          message = 'Custom domain is only available for Pro and Team plans. Please upgrade your plan.';
          break;
        
        case 'codeExport':
          canAccess = subscription.canExportCode();
          message = 'Code export is only available for Pro and Team plans. Please upgrade your plan.';
          break;
        
        case 'cms':
          canAccess = subscription.canUseCMS();
          message = 'CMS features are only available for Team plan. Please upgrade your plan.';
          break;
        
        case 'collaboration':
          canAccess = subscription.canCollaborate();
          message = 'Collaboration features are only available for Team plan. Please upgrade your plan.';
          break;
        
        default:
          canAccess = true;
      }

      if (!canAccess) {
        return res.status(403).json({
          success: false,
          message,
          upgrade: true,
          currentPlan: subscription.plan,
          availablePlans: Object.keys(STRIPE_PLANS).filter(plan => 
            STRIPE_PLANS[plan].limits[feature] === true || 
            STRIPE_PLANS[plan].limits[feature] > subscription.limits[feature]
          )
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check subscription limits'
      });
    }
  };
};

// Middleware to check storage limit
const checkStorageLimit = (sizeInMB) => {
  return async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne({ user: req.user.id });
      
      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: 'No subscription found'
        });
      }

      if (!subscription.hasStorageSpace(sizeInMB)) {
        return res.status(403).json({
          success: false,
          message: `Storage limit exceeded. Used: ${subscription.usage.storage}MB, Limit: ${subscription.limits.storage}MB`,
          upgrade: true,
          currentPlan: subscription.plan
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error('Storage check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check storage limits'
      });
    }
  };
};

// Middleware to get subscription info (non-blocking)
const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Get subscription error:', error);
    req.subscription = null;
    next();
  }
};

// Helper function to update usage after successful operation
const updateUsage = async (userId, type, increment = 1) => {
  try {
    const subscription = await Subscription.findOne({ user: userId });
    if (subscription) {
      if (type === 'projects') {
        subscription.usage.projects += increment;
      } else if (type === 'storage') {
        subscription.usage.storage += increment;
      }
      await subscription.save();
    }
  } catch (error) {
    console.error('Update usage error:', error);
  }
};

// Helper function to check if user can access feature
const canAccessFeature = async (userId, feature) => {
  try {
    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription) return false;

    switch (feature) {
      case 'customDomain':
        return subscription.canUseCustomDomain();
      case 'codeExport':
        return subscription.canExportCode();
      case 'cms':
        return subscription.canUseCMS();
      case 'collaboration':
        return subscription.canCollaborate();
      default:
        return true;
    }
  } catch (error) {
    console.error('Can access feature error:', error);
    return false;
  }
};

module.exports = {
  checkSubscriptionLimit,
  checkStorageLimit,
  getSubscription,
  updateUsage,
  canAccessFeature
};
