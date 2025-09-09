const Stripe = require('stripe');

// Initialize Stripe with secret key - handle missing key gracefully
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== '') {
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️  Stripe API key not configured. Billing features will be disabled.');
}

// Stripe product and price configurations
const STRIPE_PLANS = {
  free: {
    name: 'Free Plan',
    price: 0,
    priceId: null, // Free plan doesn't need Stripe price ID
    features: [
      '3 Projects',
      '10 Templates',
      'Subdomain hosting',
      'Basic support'
    ],
    limits: {
      projects: 3,
      templates: 10,
      customDomain: false,
      codeExport: false,
      cms: false,
      collaboration: false,
      storage: 100 // MB
    }
  },
  pro: {
    name: 'Pro Plan',
    price: 19,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      '25 Projects',
      '100 Templates',
      'Custom domain',
      'Code export',
      'Priority support',
      '1GB Storage'
    ],
    limits: {
      projects: 25,
      templates: 100,
      customDomain: true,
      codeExport: true,
      cms: false,
      collaboration: false,
      storage: 1000 // MB
    }
  },
  team: {
    name: 'Team Plan',
    price: 49,
    priceId: 'price_team_monthly', // Replace with actual Stripe price ID
    features: [
      '100 Projects',
      '500 Templates',
      'Custom domain',
      'Code export',
      'CMS & Content management',
      'Team collaboration',
      'Priority support',
      '5GB Storage'
    ],
    limits: {
      projects: 100,
      templates: 500,
      customDomain: true,
      codeExport: true,
      cms: true,
      collaboration: true,
      storage: 5000 // MB
    }
  }
};

// Helper function to create Stripe customer
const createCustomer = async (email, name) => {
  if (!stripe) {
    throw new Error('Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'website-builder'
      }
    });
    return customer;
  } catch (error) {
    throw new Error(`Failed to create Stripe customer: ${error.message}`);
  }
};

// Helper function to create subscription
const createSubscription = async (customerId, priceId, trialDays = 0) => {
  if (!stripe) {
    throw new Error('Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  try {
    const subscriptionData = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        source: 'website-builder'
      }
    };

    if (trialDays > 0) {
      subscriptionData.trial_period_days = trialDays;
    }

    const subscription = await stripe.subscriptions.create(subscriptionData);
    return subscription;
  } catch (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

// Helper function to update subscription
const updateSubscription = async (subscriptionId, newPriceId) => {
  if (!stripe) {
    throw new Error('Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    });
    
    return updatedSubscription;
  } catch (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
};

// Helper function to cancel subscription
const cancelSubscription = async (subscriptionId, cancelAtPeriodEnd = true) => {
  if (!stripe) {
    throw new Error('Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    });
    return subscription;
  } catch (error) {
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
};

// Helper function to create billing portal session
const createBillingPortalSession = async (customerId, returnUrl) => {
  if (!stripe) {
    throw new Error('Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  } catch (error) {
    throw new Error(`Failed to create billing portal session: ${error.message}`);
  }
};

// Helper function to create checkout session
const createCheckoutSession = async (customerId, priceId, successUrl, cancelUrl) => {
  if (!stripe) {
    throw new Error('Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        source: 'website-builder'
      }
    });
    return session;
  } catch (error) {
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};

module.exports = {
  stripe,
  STRIPE_PLANS,
  createCustomer,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  createBillingPortalSession,
  createCheckoutSession
};
