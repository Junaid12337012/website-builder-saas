import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  ChevronRight,
  ChevronDown,
  Play,
  FileText,
  Zap,
  Palette,
  Code,
  Globe,
  Users,
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const quickStart = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Getting Started',
      description: 'Learn the basics of WebBuilder in 5 minutes',
      duration: '5 min read',
      link: '#getting-started'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Design Your First Page',
      description: 'Step-by-step guide to creating your first webpage',
      duration: '10 min read',
      link: '#first-page'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Publishing Your Site',
      description: 'Deploy your website to the web in one click',
      duration: '3 min read',
      link: '#publishing'
    }
  ];

  const categories = [
    {
      id: 'basics',
      title: 'Getting Started',
      icon: <Book className="w-5 h-5" />,
      articles: [
        { title: 'Creating Your First Project', views: '12.5k', link: '#' },
        { title: 'Understanding the Interface', views: '8.2k', link: '#' },
        { title: 'Basic Drag & Drop Operations', views: '15.1k', link: '#' },
        { title: 'Saving and Managing Projects', views: '6.8k', link: '#' }
      ]
    },
    {
      id: 'design',
      title: 'Design & Styling',
      icon: <Palette className="w-5 h-5" />,
      articles: [
        { title: 'Using the Theme Manager', views: '9.3k', link: '#' },
        { title: 'Custom CSS and Styling', views: '11.7k', link: '#' },
        { title: 'Working with Components', views: '13.4k', link: '#' },
        { title: 'Responsive Design Controls', views: '7.9k', link: '#' }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: <Code className="w-5 h-5" />,
      articles: [
        { title: 'Code Export Options', views: '5.6k', link: '#' },
        { title: 'Custom Integrations', views: '4.2k', link: '#' },
        { title: 'Animation System', views: '8.1k', link: '#' },
        { title: 'CMS and Dynamic Content', views: '6.5k', link: '#' }
      ]
    },
    {
      id: 'publishing',
      title: 'Publishing & Deployment',
      icon: <Globe className="w-5 h-5" />,
      articles: [
        { title: 'Publishing to Netlify', views: '10.2k', link: '#' },
        { title: 'Custom Domain Setup', views: '7.8k', link: '#' },
        { title: 'SEO Optimization', views: '9.1k', link: '#' },
        { title: 'Performance Best Practices', views: '5.4k', link: '#' }
      ]
    },
    {
      id: 'collaboration',
      title: 'Team & Collaboration',
      icon: <Users className="w-5 h-5" />,
      articles: [
        { title: 'Inviting Team Members', views: '4.7k', link: '#' },
        { title: 'Permission Management', views: '3.9k', link: '#' },
        { title: 'Version Control', views: '6.2k', link: '#' },
        { title: 'Commenting and Feedback', views: '5.1k', link: '#' }
      ]
    },
    {
      id: 'account',
      title: 'Account & Billing',
      icon: <Settings className="w-5 h-5" />,
      articles: [
        { title: 'Managing Your Subscription', views: '8.5k', link: '#' },
        { title: 'Upgrading Your Plan', views: '6.3k', link: '#' },
        { title: 'Billing and Invoices', views: '4.8k', link: '#' },
        { title: 'Account Security', views: '3.6k', link: '#' }
      ]
    }
  ];

  const videos = [
    {
      title: 'WebBuilder Overview - Complete Walkthrough',
      duration: '15:32',
      views: '45.2k',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop'
    },
    {
      title: 'Building a Landing Page from Scratch',
      duration: '22:18',
      views: '32.1k',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop'
    },
    {
      title: 'Advanced Animation Techniques',
      duration: '18:45',
      views: '28.7k',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop'
    },
    {
      title: 'Team Collaboration Best Practices',
      duration: '12:56',
      views: '19.3k',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop'
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Help &
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Documentation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Everything you need to know about WebBuilder. From getting started to advanced features, 
              we've got you covered.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start Guides</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              New to WebBuilder? Start here with our essential guides to get you up and running quickly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickStart.map((guide, index) => (
              <motion.a
                key={index}
                href={guide.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="block p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-105"
              >
                <div className="text-primary-600 mb-4">{guide.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{guide.title}</h3>
                <p className="text-gray-600 mb-4">{guide.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{guide.duration}</span>
                  <ChevronRight className="w-4 h-4 text-primary-600" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Documentation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive documentation organized by topic.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <div className="text-primary-600 mr-4">{category.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {category.articles.length}
                    </span>
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 bg-white rounded-xl border border-gray-100 overflow-hidden"
                  >
                    {category.articles.map((article, articleIndex) => (
                      <a
                        key={articleIndex}
                        href={article.link}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-900">{article.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{article.views} views</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Video Tutorials</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn by watching our step-by-step video tutorials covering all aspects of WebBuilder.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative aspect-video bg-gray-100">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{video.views} views</span>
                    <div className="flex items-center">
                      <Video className="w-4 h-4 mr-1" />
                      <span>Tutorial</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              View All Videos
            </button>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-primary-600 mb-4 flex justify-center">
                <MessageCircle className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Chat</h3>
              <p className="text-gray-600 mb-6">
                Get instant help from our support team. Available 24/7 for Pro and Team users.
              </p>
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Start Chat
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-primary-600 mb-4 flex justify-center">
                <HelpCircle className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Support Ticket</h3>
              <p className="text-gray-600 mb-6">
                Submit a detailed support request and we'll get back to you within 2 hours.
              </p>
              <button className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                Create Ticket
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-primary-600 mb-4 flex justify-center">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600 mb-6">
                Join our community forum to connect with other users and share knowledge.
              </p>
              <button className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                Join Community
              </button>
            </motion.div>
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Building?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Now that you know how to use WebBuilder, it's time to create something amazing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Start Building
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                Browse Templates
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
