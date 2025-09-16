import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Zap,
  Palette,
  Code,
  Globe,
  Users,
  Star,
  Database,
  Sparkles,
  Layers,
  Smartphone,
  Monitor,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useSubscription } from '../hooks/useSubscription';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { subscription } = useSubscription();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path, e) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      const sectionId = path.substring(2); // Remove '/#'
      
      // If we're not on the home page, navigate there first
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // We're already on home page, just scroll
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navLinks = [
    { name: 'Features', path: '/features', anchor: '/#features' },
    { name: 'Templates', path: '/templates' },
    { name: 'Integrations', path: '/integrations' },
    { name: 'Pricing', path: '/pricing', anchor: '/#pricing' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about', anchor: '/#about' },
    { name: 'Contact', path: '/contact', anchor: '/#contact' },
    { name: 'Help', path: '/help', anchor: '/#help' }
  ];

  const productFeatures = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Drag & Drop Builder',
      description: 'Build websites visually with our intuitive editor',
      path: '/features',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'Design System',
      description: 'Professional themes and components',
      path: '/features',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: 'Code Export',
      description: 'Export clean HTML, CSS, and React code',
      path: '/features',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'One-Click Deploy',
      description: 'Publish to Netlify, Vercel, and more',
      path: '/features',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: 'Mobile First',
      description: 'Responsive designs that work on all devices',
      path: '/features',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: 'Component Library',
      description: 'Pre-built components for faster development',
      path: '/templates',
      gradient: 'from-teal-500 to-blue-500'
    }
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">WebBuilder</span>
              <span className="text-xs text-neutral-500 font-medium -mt-1">Pro</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Product Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive('/features') 
                    ? 'text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 shadow-sm' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50/80 backdrop-blur-sm'
                }`}
              >
                <span>Product</span>
                <ChevronDown className={`w-4 h-4 transition-all duration-300 ${isProductMenuOpen ? 'rotate-180 text-primary-600' : ''}`} />
              </button>

              <AnimatePresence>
                {isProductMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute top-full left-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {productFeatures.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link
                              to={feature.path}
                              className="group flex flex-col items-start p-4 rounded-xl hover:bg-gradient-to-br hover:from-neutral-50 hover:to-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                              onClick={() => setIsProductMenuOpen(false)}
                            >
                              <div className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <div className="text-white">
                                  {feature.icon}
                                </div>
                              </div>
                              <h4 className="font-semibold text-neutral-900 mb-1 group-hover:text-primary-700 transition-colors">{feature.title}</h4>
                              <p className="text-xs text-neutral-600 leading-relaxed">{feature.description}</p>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-neutral-100">
                        <Link
                          to="/templates"
                          className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                          onClick={() => setIsProductMenuOpen(false)}
                        >
                          <div>
                            <h4 className="font-semibold text-white mb-1">Browse Templates</h4>
                            <p className="text-sm text-primary-100">Professional designs ready to use</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Links */}
            {navLinks.slice(0, 5).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 shadow-sm'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50/80 backdrop-blur-sm'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      {subscription && (
                        <p className="text-xs text-gray-500 capitalize">{subscription.plan} Plan</p>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                      >
                        <div className="p-2">
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Dashboard</span>
                          </Link>
                          <Link
                            to="/cms"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Database className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Content Management</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Profile</span>
                          </Link>
                          <Link
                            to="/billing"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Billing & Settings</span>
                          </Link>
                          <hr className="my-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:text-primary-600 transition-all duration-300 rounded-xl hover:bg-neutral-50/80"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl hover:bg-neutral-100/80 backdrop-blur-sm transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-neutral-700" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-700" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-xl"
          >
            <div className="px-6 py-6 space-y-4">
              {/* Product Features */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Product</p>
                <div className="grid grid-cols-1 gap-3">
                  {productFeatures.slice(0, 4).map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={feature.path}
                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-neutral-50 hover:to-white transition-all duration-300 group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">{feature.title}</p>
                          <p className="text-sm text-neutral-600">{feature.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <hr className="my-4" />

              {/* Navigation Links */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                      isActive(link.path)
                        ? 'text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 shadow-sm'
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50/80'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <hr className="my-4" />

              {/* Auth Actions */}
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {subscription && (
                        <p className="text-sm text-gray-500 capitalize">{subscription.plan} Plan</p>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Dashboard</span>
                  </Link>
                  <Link
                    to="/cms"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Database className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Content Management</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Profile</span>
                  </Link>
                  <Link
                    to="/billing"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Billing & Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="text-red-600">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-center text-neutral-700 hover:text-primary-600 transition-all duration-300 rounded-xl hover:bg-neutral-50/80 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
