import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  Tag,
  TrendingUp,
  BookOpen,
  Coffee,
  Lightbulb,
  Code,
  Palette,
  Globe,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tutorials', name: 'Tutorials', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'design', name: 'Design', icon: <Palette className="w-4 h-4" /> },
    { id: 'development', name: 'Development', icon: <Code className="w-4 h-4" /> },
    { id: 'business', name: 'Business', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'updates', name: 'Updates', icon: <Globe className="w-4 h-4" /> },
    { id: 'community', name: 'Community', icon: <Users className="w-4 h-4" /> }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Building Responsive Websites: A Complete Guide',
      excerpt: 'Learn how to create websites that look great on all devices with modern CSS techniques and best practices.',
      category: 'tutorials',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
      tags: ['CSS', 'Responsive Design', 'Mobile-First'],
      featured: true
    },
    {
      id: 2,
      title: 'The Future of Web Design: Trends for 2024',
      excerpt: 'Explore the latest design trends that are shaping the web in 2024, from minimalism to bold typography.',
      category: 'design',
      author: 'Mike Chen',
      date: '2024-01-12',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop',
      tags: ['Design Trends', 'UI/UX', 'Typography'],
      featured: false
    },
    {
      id: 3,
      title: 'How to Optimize Your Website for Speed',
      excerpt: 'Discover proven techniques to make your website load faster and improve user experience.',
      category: 'development',
      author: 'Alex Rodriguez',
      date: '2024-01-10',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      tags: ['Performance', 'Optimization', 'Core Web Vitals'],
      featured: false
    },
    {
      id: 4,
      title: 'Growing Your Online Business with WebBuilder',
      excerpt: 'Success stories and strategies from entrepreneurs who built thriving businesses using our platform.',
      category: 'business',
      author: 'Emma Davis',
      date: '2024-01-08',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
      tags: ['Business Growth', 'Success Stories', 'Entrepreneurship'],
      featured: true
    },
    {
      id: 5,
      title: 'New Template Collection: Modern Business Designs',
      excerpt: 'Introducing our latest collection of professional business templates designed for modern companies.',
      category: 'updates',
      author: 'WebBuilder Team',
      date: '2024-01-05',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop',
      tags: ['Templates', 'Business', 'New Release'],
      featured: false
    },
    {
      id: 6,
      title: 'Community Spotlight: Amazing Websites Built by You',
      excerpt: 'Showcasing incredible websites created by our community members and the stories behind them.',
      category: 'community',
      author: 'Lisa Park',
      date: '2024-01-03',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      tags: ['Community', 'Showcase', 'Inspiration'],
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const BlogCard = ({ post, featured = false }) => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
            {categories.find(cat => cat.id === post.category)?.name}
          </span>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <h2 className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3 ${
          featured ? 'text-xl md:text-2xl' : 'text-lg'
        }`}>
          {post.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
          <span>Read More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
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
              WebBuilder Blog
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Stay updated with the latest web design trends, tutorials, and insights 
              from our team and community.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
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

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Never Miss an Update
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest articles, tutorials, 
              and product updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
