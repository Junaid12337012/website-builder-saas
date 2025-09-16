import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  Star, 
  Eye, 
  Heart, 
  Download, 
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  Store,
  Briefcase,
  User,
  BookOpen,
  Palette,
  Code,
  Zap,
  Globe,
  Camera,
  Music,
  Gamepad2,
  ShoppingCart,
  Coffee,
  Plane,
  Car,
  Home,
  Building,
  GraduationCap,
  Stethoscope,
  Dumbbell,
  Utensils,
  ArrowUpDown,
  ChevronDown,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  SortAsc
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  const categories = [
    { id: 'all', name: 'All Templates', icon: <Grid className="w-4 h-4" />, count: 150, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'business', name: 'Business', icon: <Briefcase className="w-4 h-4" />, count: 32, gradient: 'from-indigo-500 to-purple-500' },
    { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingBag className="w-4 h-4" />, count: 28, gradient: 'from-green-500 to-emerald-500' },
    { id: 'portfolio', name: 'Portfolio', icon: <Camera className="w-4 h-4" />, count: 24, gradient: 'from-pink-500 to-rose-500' },
    { id: 'blog', name: 'Blog', icon: <BookOpen className="w-4 h-4" />, count: 18, gradient: 'from-orange-500 to-red-500' },
    { id: 'landing', name: 'Landing Page', icon: <Zap className="w-4 h-4" />, count: 22, gradient: 'from-yellow-500 to-orange-500' },
    { id: 'creative', name: 'Creative', icon: <Palette className="w-4 h-4" />, count: 16, gradient: 'from-purple-500 to-pink-500' },
    { id: 'nonprofit', name: 'Non-profit', icon: <Heart className="w-4 h-4" />, count: 12, gradient: 'from-red-500 to-pink-500' },
    { id: 'music', name: 'Music & Arts', icon: <Music className="w-4 h-4" />, count: 8, gradient: 'from-teal-500 to-blue-500' }
  ];

  const templates = [
    {
      id: 1,
      name: 'Modern Business',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      description: 'Professional business website with clean design',
      rating: 4.8,
      downloads: 1250,
      isPro: false,
      tags: ['responsive', 'modern', 'corporate']
    },
    {
      id: 2,
      name: 'E-commerce Store',
      category: 'ecommerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      description: 'Complete online store with shopping cart',
      rating: 4.9,
      downloads: 980,
      isPro: true,
      tags: ['ecommerce', 'shopping', 'modern']
    },
    {
      id: 3,
      name: 'Creative Portfolio',
      category: 'portfolio',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      description: 'Showcase your work with style',
      rating: 4.7,
      downloads: 2100,
      isPro: false,
      tags: ['portfolio', 'creative', 'gallery']
    },
    {
      id: 4,
      name: 'Tech Startup',
      category: 'landing',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      description: 'Perfect for tech companies and startups',
      rating: 4.6,
      downloads: 1500,
      isPro: true,
      tags: ['startup', 'tech', 'modern']
    },
    {
      id: 5,
      name: 'Food Blog',
      category: 'blog',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      description: 'Beautiful blog template for food lovers',
      rating: 4.5,
      downloads: 890,
      isPro: false,
      tags: ['blog', 'food', 'lifestyle']
    },
    {
      id: 6,
      name: 'Charity Foundation',
      category: 'nonprofit',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
      description: 'Inspire donations and support',
      rating: 4.8,
      downloads: 650,
      isPro: false,
      tags: ['nonprofit', 'charity', 'donation']
    },
    {
      id: 7,
      name: 'Music Artist',
      category: 'music',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      description: 'Perfect for musicians and artists',
      rating: 4.7,
      downloads: 1100,
      isPro: true,
      tags: ['music', 'artist', 'creative']
    },
    {
      id: 8,
      name: 'Creative Agency',
      category: 'creative',
      image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop',
      description: 'Bold design for creative agencies',
      rating: 4.9,
      downloads: 1800,
      isPro: true,
      tags: ['agency', 'creative', 'bold']
    }
  ];

  useEffect(() => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  }, [searchTerm, selectedCategory]);

  const TemplateCard = ({ template }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-100 hover:border-neutral-200"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <img
            src={template.image}
            alt={template.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-sm border ${
              template.category === 'business' ? 'bg-blue-500/90 text-white border-blue-400/50' :
              template.category === 'portfolio' ? 'bg-purple-500/90 text-white border-purple-400/50' :
              template.category === 'ecommerce' ? 'bg-green-500/90 text-white border-green-400/50' :
              template.category === 'blog' ? 'bg-orange-500/90 text-white border-orange-400/50' :
              'bg-neutral-500/90 text-white border-neutral-400/50'
            }`}>
              {template.category.toUpperCase()}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <Eye className="w-4 h-4 text-neutral-700" />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <Heart className="w-4 h-4 text-neutral-700" />
            </button>
          </div>
          
          {/* Premium Badge */}
          {template.isPro && (
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                <Crown className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">PRO</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors mb-1 line-clamp-1">
                {template.name}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-neutral-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="font-medium">{template.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{template.downloads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{template.downloads}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-neutral-600 text-sm mb-6 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(template.tags || ['Responsive', 'Modern']).slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Use Template
            </button>
            <button className="px-4 py-3 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-2xl hover:bg-neutral-200 transition-colors">
              Preview
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <Navbar />
      
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Back Button & Breadcrumbs */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>
              
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm">
                <button className="flex items-center space-x-1 text-neutral-500 hover:text-primary-600 transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
                <button className="text-neutral-500 hover:text-primary-600 transition-colors">
                  Website Builder
                </button>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-900 font-medium">Templates</span>
              </nav>
            </div>
            
            {/* Page Options */}
            <div className="flex items-center space-x-3">
              {/* Quick Filter */}
              <button className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Filter</span>
              </button>
              
              {/* Quick Sort */}
              <button className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200">
                <SortAsc className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Sort</span>
              </button>
              
              {/* More Options */}
              <div className="relative">
                <button className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 pt-28 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                  Templates
                </h1>
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <span className="text-xs font-bold text-white">150+ NEW</span>
                </div>
              </div>
            </div>
            
            <p className="text-xl text-primary-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              Choose from our collection of professionally designed, conversion-optimized templates. 
              Built by experts, loved by creators worldwide.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neutral-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search by name, category, or style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white/95 backdrop-blur-sm rounded-2xl text-neutral-900 placeholder-neutral-500 focus:ring-2 focus:ring-white/50 focus:outline-none shadow-2xl text-lg font-medium"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="px-3 py-1 bg-neutral-100 rounded-lg">
                    <span className="text-xs font-medium text-neutral-600">⌘K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center space-x-8 text-primary-100">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">150+ Templates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">50K+ Downloads</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-medium">4.9 Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center space-x-3 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg shadow-primary-500/25`
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-white/20' 
                    : `bg-gradient-to-r ${category.gradient} text-white group-hover:scale-110`
                }`}>
                  {selectedCategory === category.id ? (
                    <div className="text-white">{category.icon}</div>
                  ) : (
                    category.icon
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span>{category.name}</span>
                  <span className={`text-xs ${
                    selectedCategory === category.id ? 'text-white/80' : 'text-neutral-500'
                  }`}>
                    {category.count} templates
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-6">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-2xl p-1 shadow-sm border border-neutral-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort by</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            {/* Results Count */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-xl border border-neutral-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-neutral-700">
                {filteredTemplates.length} templates found
              </span>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TemplatesPage;
