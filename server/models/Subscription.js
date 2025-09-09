const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  stripeCustomerId: {
    type: String,
    required: true,
    unique: true
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    sparse: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'team'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due', 'trialing'],
    default: 'active'
  },
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  trialEnd: Date,
  // Plan limits
  limits: {
    projects: {
      type: Number,
      default: function() {
        switch(this.plan) {
          case 'free': return 3;
          case 'pro': return 25;
          case 'team': return 100;
          default: return 3;
        }
      }
    },
    templates: {
      type: Number,
      default: function() {
        switch(this.plan) {
          case 'free': return 10;
          case 'pro': return 100;
          case 'team': return 500;
          default: return 10;
        }
      }
    },
    customDomain: {
      type: Boolean,
      default: function() {
        return this.plan !== 'free';
      }
    },
    codeExport: {
      type: Boolean,
      default: function() {
        return this.plan !== 'free';
      }
    },
    cms: {
      type: Boolean,
      default: function() {
        return this.plan === 'team';
      }
    },
    collaboration: {
      type: Boolean,
      default: function() {
        return this.plan === 'team';
      }
    },
    storage: {
      type: Number, // in MB
      default: function() {
        switch(this.plan) {
          case 'free': return 100;
          case 'pro': return 1000;
          case 'team': return 5000;
          default: return 100;
        }
      }
    }
  },
  // Billing information
  billing: {
    email: String,
    name: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String
    }
  },
  // Usage tracking
  usage: {
    projects: {
      type: Number,
      default: 0
    },
    storage: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ stripeCustomerId: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

// Update limits when plan changes
subscriptionSchema.pre('save', function(next) {
  if (this.isModified('plan')) {
    this.limits.projects = this.limits.projects;
    this.limits.templates = this.limits.templates;
    this.limits.customDomain = this.limits.customDomain;
    this.limits.codeExport = this.limits.codeExport;
    this.limits.cms = this.limits.cms;
    this.limits.collaboration = this.limits.collaboration;
    this.limits.storage = this.limits.storage;
  }
  next();
});

// Check if user can perform action based on limits
subscriptionSchema.methods.canCreateProject = function() {
  return this.usage.projects < this.limits.projects;
};

subscriptionSchema.methods.canUseCustomDomain = function() {
  return this.limits.customDomain;
};

subscriptionSchema.methods.canExportCode = function() {
  return this.limits.codeExport;
};

subscriptionSchema.methods.canUseCMS = function() {
  return this.limits.cms;
};

subscriptionSchema.methods.canCollaborate = function() {
  return this.limits.collaboration;
};

subscriptionSchema.methods.hasStorageSpace = function(sizeInMB) {
  return (this.usage.storage + sizeInMB) <= this.limits.storage;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
