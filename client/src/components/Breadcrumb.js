import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  
  // Define page titles for different routes
  const pageTitles = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/features': 'Features',
    '/pricing': 'Pricing',
    '/about': 'About',
    '/contact': 'Contact',
    '/help': 'Help',
    '/templates': 'Templates',
    '/integrations': 'Integrations',
    '/blog': 'Blog',
    '/careers': 'Careers',
    '/cms': 'Content Management',
    '/billing': 'Billing & Settings',
    '/profile': 'Profile',
    '/login': 'Sign In',
    '/register': 'Sign Up'
  };

  // If custom items are provided, use them
  if (customItems) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="flex items-center hover:text-primary-600 transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        {customItems.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {item.href ? (
              <Link 
                to={item.href} 
                className="hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Generate breadcrumbs from current path
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Don't show breadcrumbs on home page or if no segments
  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbItems = [];
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Handle dynamic routes like /editor/:projectId
    let displayName = pageTitles[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Special handling for editor pages
    if (segment === 'editor' || (pathSegments[index - 1] === 'editor' && !isNaN(segment))) {
      if (segment === 'editor') {
        displayName = 'Editor';
      } else {
        displayName = `Project ${segment}`;
      }
    }

    breadcrumbItems.push({
      label: displayName,
      href: isLast ? null : currentPath,
      isLast
    });
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link to="/" className="flex items-center hover:text-primary-600 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
