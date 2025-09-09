import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Zap, 
  Users, 
  Building, 
  Star,
  ArrowRight,
  Globe,
  Code,
  Palette,
  Shield,
  Headphones,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSubscription } from '../hooks/useSubscription';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { user } = useAuthStore();
  const { subscription } = useSubscription();

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      icon: <Zap className="w-6 h-6" />,
      color: 'gray',
      features: [
        { name: '3 Projects', included: true },
        { name: '10 Templates', included: true },
        { name: 'Subdomain Publishing', included: true },
        { name: '100MB Storage', included: true },
        { name: 'Community Support', included: true },
        { name: 'Custom Domain', included: false },
        { name: 'Code Export', included: false },
        { name: 'Advanced Analytics', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Team Collaboration', included: false }
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 19, yearly: 190 },
      description: 'For professionals and growing businesses',
      icon: <Users className="w-6 h-6" />,
      color: 'primary',
      features: [
        { name: '25 Projects', included: true },
        { name: 'Unlimited Templates', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'Code Export (HTML/CSS/React)', included: true },
        { name: '1GB Storage', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Priority Email Support', included: true },
        { name: 'Remove WebBuilder Branding', included: true },
        { name: 'Team Collaboration', included: false },
        { name: 'White-label Solution', included: false }
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Team',
      price: { monthly: 49, yearly: 490 },
      description: 'For teams and agencies',
      icon: <Building className="w-6 h-6" />,
      color: 'secondary',
      features: [
        { name: '100 Projects', included: true },
        { name: 'Unlimited Templates', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'Code Export (HTML/CSS/React)', included: true },
        { name: '5GB Storage', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Priority Support + Phone', included: true },
        { name: 'Team Collaboration (5 members)', included: true },
        { name: 'CMS & Dynamic Content', included: true },
        { name: 'White-label Solution', included: true }
      ],
      cta: 'Start Team Trial',
      popular: false
    }
  ];

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global CDN',
      description: 'Lightning-fast loading times worldwide'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'SSL Security',
      description: 'Free SSL certificates for all websites'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Clean Code Export',
      description: 'Export production-ready code anytime'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Design System',
      description: 'Professional themes and components'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Automatic Backups',
      description: 'Never lose your work with daily backups'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: '24/7 Support',
      description: 'Get help whenever you need it'
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
    },
    {
      question: 'What happens if I exceed my project limit?',
      answer: 'You\'ll be prompted to upgrade your plan. Your existing projects will remain accessible, but you won\'t be able to create new ones until you upgrade.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact us for a full refund.'
    },
    {
      question: 'Can I export my website code?',
      answer: 'Pro and Team plans include code export functionality. You can export clean HTML, CSS, and React code for your projects.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.'
    }
  ];

  const getCurrentPlan = () => {
    if (!subscription) return 'free';
    return subscription.plan.toLowerCase();
  };

  const getPlanColor = (color) => {
    const colors = {
      gray: 'border-gray-200 bg-gray-50',
      primary: 'border-primary-200 bg-primary-50 ring-2 ring-primary-500',
      secondary: 'border-secondary-200 bg-secondary-50'
    };
    return colors[color] || colors.gray;
  };

  const getButtonColor = (color, isCurrentPlan) => {
    if (isCurrentPlan) {
      return 'bg-gray-100 text-gray-500 cursor-not-allowed';
    }
    
    const colors = {
      gray: 'bg-gray-900 hover:bg-gray-800 text-white',
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Transparent
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Choose the perfect plan for your needs. Start free and upgrade as you grow.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Save 17%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const isCurrentPlan = getCurrentPlan() === plan.name.toLowerCase();
              const price = plan.price[billingCycle];
              const yearlyPrice = plan.price.yearly;
              const monthlyEquivalent = billingCycle === 'yearly' ? Math.round(yearlyPrice / 12) : price;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`relative rounded-2xl border-2 p-8 ${getPlanColor(plan.color)} ${
                    plan.popular ? 'transform scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        <Star className="w-4 h-4" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <div className={`inline-flex p-3 rounded-xl mb-4 ${
                      plan.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                      plan.color === 'secondary' ? 'bg-secondary-100 text-secondary-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {plan.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-gray-900">${monthlyEquivalent}</span>
                        <span className="text-gray-600 ml-1">/month</span>
                      </div>
                      {billingCycle === 'yearly' && price > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Billed annually (${yearlyPrice}/year)
                        </p>
                      )}
                    </div>

                    {user ? (
                      <Link
                        to={isCurrentPlan ? '#' : '/billing'}
                        className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${getButtonColor(plan.color, isCurrentPlan)}`}
                      >
                        {isCurrentPlan ? 'Current Plan' : plan.cta}
                        {!isCurrentPlan && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Link>
                    ) : (
                      <Link
                        to="/register"
                        className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${getButtonColor(plan.color, false)}`}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </div>

                  <div className="mt-8">
                    <h4 className="font-medium text-gray-900 mb-4">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All plans include these powerful features to help you build amazing websites.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="text-primary-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already building amazing websites with WebBuilder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
