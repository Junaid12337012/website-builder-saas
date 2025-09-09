import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Palette, 
  Code, 
  Globe, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  Award,
  TrendingUp,
  Shield,
  Clock,
  Heart,
  MousePointer,
  Smartphone,
  BarChart3,
  Download,
  Upload,
  Eye,
  Settings,
  Database,
  Layers,
  Sparkles,
  Play,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Headphones,
  HelpCircle,
  Book,
  Video,
  ChevronDown,
  ChevronRight,
  FileText,
  ExternalLink,
  Send,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Building,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

const LandingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const features = [
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

  const stats = [
    { number: '50K+', label: 'Websites Created', icon: <Globe className="w-6 h-6" /> },
    { number: '10K+', label: 'Happy Users', icon: <Users className="w-6 h-6" /> },
    { number: '99.9%', label: 'Uptime', icon: <Shield className="w-6 h-6" /> },
    { number: '24/7', label: 'Support', icon: <Clock className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Innovation First',
      description: 'We constantly push the boundaries of what\'s possible in web development, bringing cutting-edge tools to everyone.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'User-Centric',
      description: 'Every feature we build is designed with our users in mind, ensuring the best possible experience.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Quality Obsessed',
      description: 'We believe in delivering exceptional quality in every aspect of our platform and service.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Accessible to All',
      description: 'Making professional web development accessible to everyone, regardless of technical background.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Former Google engineer with 10+ years in web technologies. Passionate about democratizing web development.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Full-stack architect who previously led engineering teams at Stripe and Airbnb.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Award-winning designer with expertise in UX/UI and design systems. Previously at Figma and Adobe.'
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Product strategist who helped scale products at Shopify and Slack from startup to IPO.'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      quote: 'WebBuilder helped me create a professional website in just 2 hours. The drag-and-drop interface is incredibly intuitive.',
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Freelance Designer",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      quote: 'The code export feature is amazing. I can design visually and still get clean, maintainable code for my clients.',
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Marketing Director",
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      quote: 'Our team collaboration features have streamlined our website development process significantly.',
      rating: 5
    }
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      description: 'Get in touch via email',
      value: 'hello@webbuilder.com',
      action: 'mailto:hello@webbuilder.com'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      description: 'Speak with our team',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with support',
      value: 'Available 24/7',
      action: '#'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      description: 'Our headquarters',
      value: '123 Tech Street, San Francisco, CA 94105',
      action: 'https://maps.google.com'
    }
  ];

  const helpCategories = [
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
    }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setContactForm({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const getPlanColor = (color) => {
    const colors = {
      gray: 'border-gray-200 bg-gray-50',
      primary: 'border-primary-200 bg-primary-50 ring-2 ring-primary-500',
      secondary: 'border-secondary-200 bg-secondary-50'
    };
    return colors[color] || colors.gray;
  };

  const getButtonColor = (color) => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
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

      {/* Core Features Section */}
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

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const price = plan.price[billingCycle];
              const yearlyPrice = plan.price.yearly;
              const monthlyEquivalent = billingCycle === 'yearly' ? Math.round(yearlyPrice / 12) : price;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
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

                    <Link
                      to="/register"
                      className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${getButtonColor(plan.color)}`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-medium text-gray-900 mb-4">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.slice(0, 5).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          {feature.included ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
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

      {/* Testimonials Section */}
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

      {/* About Section */}
      <section className="py-20" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-primary-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                We believe that everyone should have the power to bring their ideas to life on the web. 
                Traditional web development can be complex, time-consuming, and expensive. We're changing that.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our platform combines the power of professional development tools with the simplicity of 
                drag-and-drop design, making web creation accessible to entrepreneurs, small businesses, 
                designers, and developers alike.
              </p>
              <div className="flex items-center space-x-4">
                <Award className="w-6 h-6 text-primary-600" />
                <span className="text-gray-700 font-medium">Winner of TechCrunch Disrupt 2023</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-8"
            >
              {values.map((value, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-primary-600 mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a diverse team of engineers, designers, and product experts passionate about making web development accessible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary-600/20 to-transparent"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-gray-50" id="help">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get the help you need with our comprehensive documentation, tutorials, and support resources.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <Book className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Documentation</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive guides and API documentation to help you get started and master advanced features.
              </p>
              <button className="text-primary-600 font-medium hover:text-primary-700">
                Browse Docs →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <Video className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Tutorials</h3>
              <p className="text-gray-600 mb-6">
                Step-by-step video guides covering everything from basic setup to advanced techniques.
              </p>
              <button className="text-primary-600 font-medium hover:text-primary-700">
                Watch Tutorials →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <Headphones className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600 mb-6">
                Get help from our expert support team whenever you need it, day or night.
              </p>
              <button className="text-primary-600 font-medium hover:text-primary-700">
                Contact Support →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? Need help? Want to share feedback? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-105"
              >
                <div className="text-primary-600 mb-4 flex justify-center">{method.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="text-primary-600 font-medium">{method.value}</p>
              </motion.a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    required
                    value={contactForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Your Name"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Your Email"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  required
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Subject"
                />
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Your Message"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Support Options</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                  <Headphones className="w-8 h-8 text-primary-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h4>
                    <p className="text-gray-600 mb-3">Get help whenever you need it with our round-the-clock support team.</p>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">Response time: under 2 hours</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                  <MessageCircle className="w-8 h-8 text-primary-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h4>
                    <p className="text-gray-600 mb-3">Chat with our support team in real-time for instant assistance.</p>
                    <button className="text-primary-600 font-medium hover:text-primary-700">Start Chat →</button>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                  <HelpCircle className="w-8 h-8 text-primary-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Help Center</h4>
                    <p className="text-gray-600 mb-3">Browse our comprehensive documentation and tutorials.</p>
                    <button className="text-primary-600 font-medium hover:text-primary-700">Visit Help Center →</button>
                  </div>
                </div>
              </div>
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
              Join thousands of users who are already creating beautiful websites with WebBuilder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Building Free
              </Link>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
