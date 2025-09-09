import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  FileText, 
  Users, 
  Settings, 
  Palette, 
  Code,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Sample search data - in a real app, this would come from your API
  const searchData = [
    { id: 1, title: 'Dashboard', type: 'page', url: '/dashboard', icon: <Settings className="w-4 h-4" /> },
    { id: 2, title: 'Templates', type: 'page', url: '/templates', icon: <Palette className="w-4 h-4" /> },
    { id: 3, title: 'Integrations', type: 'page', url: '/integrations', icon: <Code className="w-4 h-4" /> },
    { id: 4, title: 'Content Management', type: 'page', url: '/cms', icon: <FileText className="w-4 h-4" /> },
    { id: 5, title: 'Profile Settings', type: 'page', url: '/profile', icon: <Users className="w-4 h-4" /> },
    { id: 6, title: 'Billing & Settings', type: 'page', url: '/billing', icon: <Settings className="w-4 h-4" /> },
    { id: 7, title: 'Modern Business Template', type: 'template', url: '/templates', icon: <Palette className="w-4 h-4" /> },
    { id: 8, title: 'E-commerce Store Template', type: 'template', url: '/templates', icon: <Palette className="w-4 h-4" /> },
    { id: 9, title: 'Google Analytics Integration', type: 'integration', url: '/integrations', icon: <Code className="w-4 h-4" /> },
    { id: 10, title: 'Stripe Payment Integration', type: 'integration', url: '/integrations', icon: <Code className="w-4 h-4" /> }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8)); // Limit to 8 results
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultClick = (result) => {
    // Add to recent searches
    const newRecent = [result, ...recentSearches.filter(r => r.id !== result.id)].slice(0, 5);
    setRecentSearches(newRecent);
    
    // Navigate to the result
    navigate(result.url);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search pages, templates, integrations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-lg outline-none placeholder-gray-400"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {query && results.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                  Search Results
                </div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="text-gray-500">
                      {result.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{result.title}</div>
                      <div className="text-sm text-gray-500 capitalize">{result.type}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <div className="text-gray-900 font-medium mb-1">No results found</div>
                <div className="text-sm text-gray-500">Try searching for something else</div>
              </div>
            )}

            {!query && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                  Recent Searches
                </div>
                {recentSearches.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{result.title}</div>
                      <div className="text-sm text-gray-500 capitalize">{result.type}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {!query && recentSearches.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <div className="text-gray-900 font-medium mb-1">Search WebBuilder</div>
                <div className="text-sm text-gray-500">Find pages, templates, integrations, and more</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Press <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">↵</kbd> to select</span>
                <span>Press <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">esc</kbd> to close</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalSearch;
