import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Check, 
  ArrowRight,
  Zap,
  Globe,
  ShoppingBag,
  Mail,
  BarChart3,
  MessageSquare,
  Camera,
  CreditCard,
  Users,
  Calendar,
  FileText,
  Database,
  Shield,
  Smartphone,
  Headphones,
  Palette
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const IntegrationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Integrations', icon: <Globe className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'marketing', name: 'Marketing', icon: <Mail className="w-4 h-4" /> },
    { id: 'social', name: 'Social Media', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'payment', name: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'productivity', name: 'Productivity', icon: <Calendar className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> }
  ];

  const integrations = [
    {
      id: 1,
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Track website performance and user behavior with detailed analytics',
      logo: 'https://developers.google.com/analytics/images/terms/logo_lockup_analytics_icon_vertical_black_2x.png',
      rating: 4.9,
      installs: 50000,
      isPro: false,
      features: ['Real-time tracking', 'Custom events', 'Goal conversion', 'Audience insights']
    },
    {
      id: 2,
      name: 'Stripe',
      category: 'payment',
      description: 'Accept payments online with the world\'s leading payment processor',
      logo: 'https://images.ctfassets.net/fzn2n1nzq965/3AGidihOJl4nH9D1vDjM84/9540155d584be52fc54c443b6efa4ae6/stripe.png',
      rating: 4.8,
      installs: 45000,
      isPro: true,
      features: ['Credit card processing', 'Subscription billing', 'Global payments', 'Fraud protection']
    },
    {
      id: 3,
      name: 'Mailchimp',
      category: 'marketing',
      description: 'Email marketing automation and newsletter management',
      logo: 'https://eep.io/images/yzco4xsimv0y/5TEXyONTmUi4UYOSSoqGaa/54718bc78b6f5ca77b5e23c85e18c2fc/Mailchimp_Logo-Horizontal_Black.svg',
      rating: 4.7,
      installs: 38000,
      isPro: false,
      features: ['Email campaigns', 'Automation', 'Audience segmentation', 'A/B testing']
    },
    {
      id: 4,
      name: 'Shopify',
      category: 'ecommerce',
      description: 'Complete e-commerce solution for online stores',
      logo: 'https://cdn.shopify.com/s/files/1/0070/7032/files/shopify_logo_darkbg.svg',
      rating: 4.6,
      installs: 32000,
      isPro: true,
      features: ['Product management', 'Inventory tracking', 'Order processing', 'Multi-channel selling']
    },
    {
      id: 5,
      name: 'Facebook Pixel',
      category: 'social',
      description: 'Track conversions and optimize Facebook advertising campaigns',
      logo: 'https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/Kvo5FesWVKX.png',
      rating: 4.5,
      installs: 42000,
      isPro: false,
      features: ['Conversion tracking', 'Custom audiences', 'Lookalike audiences', 'Campaign optimization']
    },
    {
      id: 6,
      name: 'Zapier',
      category: 'productivity',
      description: 'Connect your website with 5000+ apps and automate workflows',
      logo: 'https://cdn.zapier.com/storage/photos/9dd0f16c85b6d1ca2c2f18a7b3c5e3c8.png',
      rating: 4.8,
      installs: 28000,
      isPro: true,
      features: ['Workflow automation', '5000+ app connections', 'Multi-step zaps', 'Custom triggers']
    },
    {
      id: 7,
      name: 'Hotjar',
      category: 'analytics',
      description: 'Understand user behavior with heatmaps and session recordings',
      logo: 'https://static.hotjar.com/static/gfx/favicon.ico',
      rating: 4.4,
      installs: 25000,
      isPro: false,
      features: ['Heatmaps', 'Session recordings', 'Conversion funnels', 'Form analysis']
    },
    {
      id: 8,
      name: 'Intercom',
      category: 'productivity',
      description: 'Customer messaging platform for support and engagement',
      logo: 'https://static.intercomassets.com/assets/default-avatars/fin-99a51d65b794c1d4b9e8b8b6b8b8b8b8.png',
      rating: 4.7,
      installs: 22000,
      isPro: true,
      features: ['Live chat', 'Help desk', 'Customer onboarding', 'Product tours']
    }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const IntegrationCard = ({ integration }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={integration.logo} 
              alt={integration.name}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded flex items-center justify-center text-white font-semibold text-sm" style={{display: 'none'}}>
              {integration.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {integration.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm text-gray-600">{integration.rating}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{integration.installs.toLocaleString()} installs</span>
            </div>
          </div>
        </div>
        
        {integration.isPro && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            PRO
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">{integration.description}</p>
      
      <div className="space-y-2 mb-6">
        {integration.features.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">{feature}</span>
          </div>
        ))}
        {integration.features.length > 3 && (
          <div className="text-sm text-gray-500">
            +{integration.features.length - 3} more features
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Install
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Integrations
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Connect your website with your favorite tools and services. 
              Extend functionality with our growing library of integrations.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-300 focus:outline-none"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredIntegrations.length} of {integrations.length} integrations
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need a Custom Integration?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find the integration you need? Our team can build custom integrations 
              for your specific requirements.
            </p>
            <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Request Custom Integration
            </button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IntegrationsPage;
