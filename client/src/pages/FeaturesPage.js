import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Palette, 
  Code, 
  Globe, 
  Users, 
  Shield,
  Smartphone,
  BarChart3,
  Download,
  Upload,
  Eye,
  Settings,
  Database,
  Layers,
  MousePointer,
  Sparkles,
  ArrowRight,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const heroFeatures = [
    {
      icon: <MousePointer className="w-12 h-12" />,
      title: 'Drag & Drop Builder',
      description: 'Build websites visually with our intuitive drag-and-drop interface. No coding required.',
      color: 'primary'
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: 'Design System',
      description: 'Professional themes, components, and design tokens for consistent, beautiful websites.',
      color: 'secondary'
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: 'Clean Code Export',
      description: 'Export production-ready HTML, CSS, and React code that developers love.',
      color: 'primary'
    }
  ];

  const coreFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Built for speed with optimized code generation and global CDN delivery.',
      benefits: ['Sub-second loading times', 'Automatic optimization', 'Global CDN network']
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Responsive Design',
      description: 'Every website automatically adapts to all screen sizes and devices.',
      benefits: ['Mobile-first approach', 'Tablet optimization', 'Desktop perfection']
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'One-Click Deploy',
      description: 'Publish to Netlify, Vercel, or your own hosting with a single click.',
      benefits: ['Multiple hosting options', 'Custom domains', 'SSL certificates']
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Work together with real-time editing and commenting features.',
      benefits: ['Real-time collaboration', 'Version control', 'Role-based permissions']
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics & SEO',
      description: 'Built-in analytics and SEO optimization tools to grow your audience.',
      benefits: ['Performance tracking', 'SEO optimization', 'Search console integration']
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with SSL, backups, and compliance features.',
      benefits: ['SSL encryption', 'Daily backups', 'GDPR compliance']
    }
  ];

  const advancedFeatures = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Design',
      description: 'Let AI suggest layouts, colors, and content based on your industry.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Dynamic Content & CMS',
      description: 'Manage content dynamically with our built-in headless CMS.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Component Library',
      description: 'Access hundreds of pre-built components and templates.',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Custom Integrations',
      description: 'Connect with your favorite tools via APIs and webhooks.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
    }
  ];

  const workflow = [
    {
      step: '01',
      title: 'Choose Template',
      description: 'Start with a professional template or create from scratch',
      icon: <Upload className="w-6 h-6" />
    },
    {
      step: '02',
      title: 'Customize Design',
      description: 'Drag, drop, and customize every element to match your brand',
      icon: <Palette className="w-6 h-6" />
    },
    {
      step: '03',
      title: 'Preview & Test',
      description: 'See how your site looks on all devices before publishing',
      icon: <Eye className="w-6 h-6" />
    },
    {
      step: '04',
      title: 'Publish & Share',
      description: 'Deploy your website with one click to your preferred platform',
      icon: <Globe className="w-6 h-6" />
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      quote: 'WebBuilder helped me create a professional website in just 2 hours. The drag-and-drop interface is incredibly intuitive.'
    },
    {
      name: 'Mike Chen',
      role: 'Freelance Designer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      quote: 'The code export feature is amazing. I can design visually and still get clean, maintainable code for my clients.'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      quote: 'Our team collaboration features have streamlined our website development process significantly.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to Build
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Amazing Websites</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              From drag-and-drop design to code export, WebBuilder provides all the tools you need 
              to create professional websites without limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                Start Building Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors inline-flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Hero Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {heroFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-2xl mb-6 ${
                  feature.color === 'primary' ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Every Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a beginner or a professional, our comprehensive feature set has you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take your websites to the next level with our advanced features and integrations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 relative overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="text-primary-600 mr-3">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple 4-Step Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From idea to live website in minutes, not hours. Our streamlined workflow makes it easy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent transform translate-x-4"></div>
                )}
                
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by Thousands</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about their experience with WebBuilder.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Something Amazing?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already creating beautiful websites with WebBuilder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Building Free
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
