import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Mail, 
  Phone, 
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  ArrowRight,
  Sparkles,
  Heart,
  Shield,
  Award,
  Users,
  Globe
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', path: '/features' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Templates', path: '/templates' },
      { name: 'Integrations', path: '/integrations' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
      { name: 'Press', path: '/press' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Community', path: '/community' },
      { name: 'Status', path: '/status' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'GDPR', path: '/gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com/webbuilder' },
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: 'https://facebook.com/webbuilder' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/webbuilder' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: 'https://linkedin.com/company/webbuilder' },
    { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: 'https://github.com/webbuilder' }
  ];

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>
      {/* Newsletter Section */}
      <div className="border-b border-neutral-800/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">Stay Updated</h3>
                  <p className="text-primary-400 text-sm font-medium">Join 50,000+ creators</p>
                </div>
              </div>
              <p className="text-neutral-300 text-lg leading-relaxed">
                Get the latest updates, exclusive templates, and pro tips delivered to your inbox.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all duration-300 text-white placeholder-neutral-400 shadow-lg"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-2xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group">
                Subscribe
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center space-x-3 mb-8 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">WebBuilder</span>
                  <span className="text-sm text-primary-400 font-medium -mt-1">Pro</span>
                </div>
              </Link>
              
              <p className="text-neutral-300 mb-8 max-w-sm text-lg leading-relaxed">
                The most powerful drag-and-drop website builder. Create stunning, responsive websites 
                without writing a single line of code.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">50K+</div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wide">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-400">1M+</div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wide">Sites Built</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">99.9%</div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wide">Uptime</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-neutral-300 hover:text-primary-400 transition-colors duration-300 group">
                  <div className="w-10 h-10 bg-neutral-800/50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-500/20 transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-medium">hello@webbuilder.com</span>
                </div>
                <div className="flex items-center text-neutral-300 hover:text-primary-400 transition-colors duration-300 group">
                  <div className="w-10 h-10 bg-neutral-800/50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-500/20 transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-medium">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-neutral-300 hover:text-primary-400 transition-colors duration-300 group">
                  <div className="w-10 h-10 bg-neutral-800/50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-500/20 transition-colors duration-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-medium">San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-neutral-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-gradient-to-r hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    aria-label={social.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-6 text-white">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-neutral-300 hover:text-primary-400 transition-all duration-300 font-medium flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-neutral-300 hover:text-primary-400 transition-all duration-300 font-medium flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-6 text-white">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-neutral-300 hover:text-primary-400 transition-all duration-300 font-medium flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-6 text-white">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-neutral-300 hover:text-primary-400 transition-all duration-300 font-medium flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              <div className="text-neutral-300 text-sm font-medium">
                © {currentYear} WebBuilder. All rights reserved.
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1 bg-neutral-800/50 rounded-full">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-neutral-400">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-neutral-800/50 rounded-full">
                  <Award className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-neutral-400">ISO 27001</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6 text-sm"
            >
              <div className="flex items-center space-x-2 text-neutral-300">
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="font-medium">Made with love in San Francisco</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-neutral-400 font-medium">All systems operational</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="font-medium">Global CDN</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
