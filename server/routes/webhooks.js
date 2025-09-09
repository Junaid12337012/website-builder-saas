const express = require('express');
const { stripe } = require('../config/stripe');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

const router = express.Router();

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle subscription created
async function handleSubscriptionCreated(stripeSubscription) {
  try {
    const subscription = await Subscription.findOne({ 
      stripeCustomerId: stripeSubscription.customer 
    });
    
    if (subscription) {
      subscription.stripeSubscriptionId = stripeSubscription.id;
      subscription.status = stripeSubscription.status;
      subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
      subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
      
      // Determine plan from price ID
      const priceId = stripeSubscription.items.data[0].price.id;
      subscription.plan = getPlanFromPriceId(priceId);
      
      if (stripeSubscription.trial_end) {
        subscription.trialEnd = new Date(stripeSubscription.trial_end * 1000);
      }
      
      await subscription.save();
      console.log('Subscription created and updated:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(stripeSubscription) {
  try {
    const subscription = await Subscription.findOne({ 
      stripeSubscriptionId: stripeSubscription.id 
    });
    
    if (subscription) {
      subscription.status = stripeSubscription.status;
      subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
      subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
      subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;
      
      // Update plan if price changed
      const priceId = stripeSubscription.items.data[0].price.id;
      subscription.plan = getPlanFromPriceId(priceId);
      
      await subscription.save();
      console.log('Subscription updated:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(stripeSubscription) {
  try {
    const subscription = await Subscription.findOne({ 
      stripeSubscriptionId: stripeSubscription.id 
    });
    
    if (subscription) {
      subscription.status = 'cancelled';
      subscription.plan = 'free';
      subscription.stripeSubscriptionId = null;
      subscription.cancelAtPeriodEnd = false;
      
      await subscription.save();
      console.log('Subscription cancelled:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice) {
  try {
    if (invoice.subscription) {
      const subscription = await Subscription.findOne({ 
        stripeSubscriptionId: invoice.subscription 
      });
      
      if (subscription) {
        subscription.status = 'active';
        await subscription.save();
        console.log('Payment succeeded for subscription:', subscription.id);
      }
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice) {
  try {
    if (invoice.subscription) {
      const subscription = await Subscription.findOne({ 
        stripeSubscriptionId: invoice.subscription 
      });
      
      if (subscription) {
        subscription.status = 'past_due';
        await subscription.save();
        console.log('Payment failed for subscription:', subscription.id);
        
        // TODO: Send email notification to user about failed payment
      }
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Handle trial ending soon
async function handleTrialWillEnd(stripeSubscription) {
  try {
    const subscription = await Subscription.findOne({ 
      stripeSubscriptionId: stripeSubscription.id 
    });
    
    if (subscription) {
      console.log('Trial ending soon for subscription:', subscription.id);
      
      // TODO: Send email notification to user about trial ending
    }
  } catch (error) {
    console.error('Error handling trial will end:', error);
  }
}

// Helper function to determine plan from Stripe price ID
function getPlanFromPriceId(priceId) {
  const { STRIPE_PLANS } = require('../config/stripe');
  
  for (const [planKey, planData] of Object.entries(STRIPE_PLANS)) {
    if (planData.priceId === priceId) {
      return planKey;
    }
  }
  
  return 'free'; // Default fallback
}

module.exports = router;
