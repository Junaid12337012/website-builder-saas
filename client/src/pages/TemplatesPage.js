import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Eye, 
  Download,
  Zap,
  Palette,
  Code,
  Globe,
  Users,
  ShoppingBag,
  Camera,
  Briefcase,
  Heart,
  Music,
  BookOpen
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  const categories = [
    { id: 'all', name: 'All Templates', icon: <Grid className="w-4 h-4" /> },
    { id: 'business', name: 'Business', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'portfolio', name: 'Portfolio', icon: <Camera className="w-4 h-4" /> },
    { id: 'blog', name: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'landing', name: 'Landing Page', icon: <Zap className="w-4 h-4" /> },
    { id: 'creative', name: 'Creative', icon: <Palette className="w-4 h-4" /> },
    { id: 'nonprofit', name: 'Non-profit', icon: <Heart className="w-4 h-4" /> },
    { id: 'music', name: 'Music & Arts', icon: <Music className="w-4 h-4" /> }
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
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative overflow-hidden">
        <img
          src={template.image}
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
            <button className="p-2 bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 transition-colors">
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        {template.isPro && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            PRO
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {template.name}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-gray-600">{template.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{template.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-gray-500">
            <Download className="w-4 h-4" />
            <span className="text-sm">{template.downloads}</span>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Use Template
          </button>
        </div>
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
              Professional Templates
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Choose from our collection of professionally designed templates. 
              Get started in minutes with responsive, modern designs.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-300 focus:outline-none"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
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

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <span className="text-sm text-gray-600">
              {filteredTemplates.length} templates
            </span>
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
