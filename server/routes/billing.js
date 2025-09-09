const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const {
  stripe,
  STRIPE_PLANS,
  createCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  updateSubscription,
  cancelSubscription
} = require('../config/stripe');

const router = express.Router();

// Get current subscription details
router.get('/subscription', auth, async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user.id });
    
    // Create default subscription if none exists
    if (!subscription) {
      let stripeCustomerId = null;
      
      // Only create Stripe customer if Stripe is configured
      try {
        const customer = await createCustomer(req.user.email, req.user.name);
        stripeCustomerId = customer.id;
      } catch (stripeError) {
        console.warn('Stripe customer creation failed, proceeding with local subscription:', stripeError.message);
      }
      
      subscription = new Subscription({
        user: req.user.id,
        stripeCustomerId: stripeCustomerId,
        plan: 'free',
        status: 'active'
      });
      await subscription.save();
    }

    res.json({
      success: true,
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        limits: subscription.limits,
        usage: subscription.usage
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription details'
    });
  }
});

// Get available plans
router.get('/plans', async (req, res) => {
  try {
    res.json({
      success: true,
      plans: STRIPE_PLANS
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans'
    });
  }
});

// Create checkout session for subscription
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!STRIPE_PLANS[planId] || planId === 'free') {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const plan = STRIPE_PLANS[planId];
    let subscription = await Subscription.findOne({ user: req.user.id });
    
    // Create subscription record if none exists
    if (!subscription) {
      const customer = await createCustomer(req.user.email, req.user.name);
      subscription = new Subscription({
        user: req.user.id,
        stripeCustomerId: customer.id,
        plan: 'free',
        status: 'active'
      });
      await subscription.save();
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession(
      subscription.stripeCustomerId,
      plan.priceId,
      `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing/cancel`
    );

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session'
    });
  }
});

// Create billing portal session
router.post('/create-portal-session', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found'
      });
    }

    const session = await createBillingPortalSession(
      subscription.stripeCustomerId,
      `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing`
    );

    res.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Create portal session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create billing portal session'
    });
  }
});

// Upgrade/downgrade subscription
router.post('/change-plan', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!STRIPE_PLANS[planId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found'
      });
    }

    // Handle downgrade to free plan
    if (planId === 'free') {
      if (subscription.stripeSubscriptionId) {
        await cancelSubscription(subscription.stripeSubscriptionId, true);
      }
      
      subscription.plan = 'free';
      subscription.status = 'active';
      subscription.cancelAtPeriodEnd = false;
      await subscription.save();
      
      return res.json({
        success: true,
        message: 'Successfully downgraded to free plan'
      });
    }

    // Handle upgrade/change to paid plan
    const plan = STRIPE_PLANS[planId];
    
    if (subscription.stripeSubscriptionId) {
      // Update existing subscription
      await updateSubscription(subscription.stripeSubscriptionId, plan.priceId);
    } else {
      // Create new subscription (shouldn't happen with checkout flow)
      return res.status(400).json({
        success: false,
        message: 'Please use checkout to subscribe to paid plans'
      });
    }

    subscription.plan = planId;
    await subscription.save();

    res.json({
      success: true,
      message: `Successfully changed to ${plan.name}`
    });
  } catch (error) {
    console.error('Change plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change plan'
    });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    const { cancelAtPeriodEnd = true } = req.body;
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    await cancelSubscription(subscription.stripeSubscriptionId, cancelAtPeriodEnd);
    
    subscription.cancelAtPeriodEnd = cancelAtPeriodEnd;
    if (!cancelAtPeriodEnd) {
      subscription.status = 'cancelled';
      subscription.plan = 'free';
    }
    await subscription.save();

    res.json({
      success: true,
      message: cancelAtPeriodEnd 
        ? 'Subscription will be cancelled at the end of the current period'
        : 'Subscription cancelled immediately'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
});

// Reactivate cancelled subscription
router.post('/reactivate', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found'
      });
    }

    // Remove cancellation
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
    
    subscription.cancelAtPeriodEnd = false;
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription reactivated successfully'
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate subscription'
    });
  }
});

// Get usage statistics
router.get('/usage', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found'
      });
    }

    // Get actual usage from database
    const Project = require('../models/Project');
    const Media = require('../models/Media');
    
    const projectCount = await Project.countDocuments({ user: req.user.id });
    const mediaFiles = await Media.find({ user: req.user.id });
    const storageUsed = mediaFiles.reduce((total, file) => total + (file.size || 0), 0) / (1024 * 1024); // Convert to MB

    // Update usage in subscription
    subscription.usage.projects = projectCount;
    subscription.usage.storage = Math.round(storageUsed);
    await subscription.save();

    res.json({
      success: true,
      usage: {
        projects: {
          used: projectCount,
          limit: subscription.limits.projects,
          percentage: Math.round((projectCount / subscription.limits.projects) * 100)
        },
        storage: {
          used: Math.round(storageUsed),
          limit: subscription.limits.storage,
          percentage: Math.round((storageUsed / subscription.limits.storage) * 100)
        }
      }
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get usage statistics'
    });
  }
});

module.exports = router;
