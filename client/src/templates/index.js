import blogTemplates from './blogTemplates';
import productTemplates from './productTemplates';
import portfolioTemplates from './portfolioTemplates';

// Combined template library
export const templates = {
  blog: blogTemplates,
  products: productTemplates,
  portfolio: portfolioTemplates
};

// Template categories for UI organization
export const templateCategories = [
  {
    id: 'blog',
    name: 'Blog',
    description: 'Templates for blog posts, listings, and content pages',
    icon: 'FileText',
    templates: Object.keys(blogTemplates)
  },
  {
    id: 'products',
    name: 'E-commerce',
    description: 'Product pages, grids, and shopping interfaces',
    icon: 'ShoppingBag',
    templates: Object.keys(productTemplates)
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase projects and creative work',
    icon: 'Briefcase',
    templates: Object.keys(portfolioTemplates)
  }
];

// Helper function to get template by category and name
export const getTemplate = (category, templateName) => {
  return templates[category]?.[templateName];
};

// Helper function to get all templates for a category
export const getTemplatesByCategory = (category) => {
  return templates[category] || {};
};

// Helper function to apply template to canvas
export const applyTemplate = (template, canvasWidth = 1200, canvasHeight = 800) => {
  if (!template || !template.elements) {
    return { elements: [], canvas: { width: canvasWidth, height: canvasHeight } };
  }

  // Scale elements to fit canvas if needed
  const scaleX = canvasWidth / 1200; // Templates are designed for 1200px width
  const scaleY = canvasHeight / 800;  // Templates are designed for 800px height

  const scaledElements = template.elements.map(element => ({
    ...element,
    position: {
      ...element.position,
      x: Math.round(element.position.x * scaleX),
      y: Math.round(element.position.y * scaleY)
    },
    dimensions: {
      ...element.dimensions,
      width: Math.round(element.dimensions.width * scaleX),
      height: Math.round(element.dimensions.height * scaleY)
    },
    // Recursively scale children if they exist
    children: element.children?.map(child => ({
      ...child,
      position: {
        ...child.position,
        x: Math.round(child.position.x * scaleX),
        y: Math.round(child.position.y * scaleY)
      },
      dimensions: {
        ...child.dimensions,
        width: Math.round(child.dimensions.width * scaleX),
        height: Math.round(child.dimensions.height * scaleY)
      }
    }))
  }));

  return {
    elements: scaledElements,
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff'
    },
    cmsRequirements: template.cmsRequirements
  };
};

// Helper function to check if user has required CMS collections for template
export const checkTemplateRequirements = (template, userCollections) => {
  if (!template.cmsRequirements) {
    return { isCompatible: true, missingCollections: [], missingFields: {} };
  }

  const requiredCollections = template.cmsRequirements.collections || [];
  const requiredFields = template.cmsRequirements.fields || {};
  
  const userCollectionSlugs = userCollections.map(col => col.slug);
  const missingCollections = requiredCollections.filter(
    slug => !userCollectionSlugs.includes(slug)
  );

  const missingFields = {};
  requiredCollections.forEach(collectionSlug => {
    const userCollection = userCollections.find(col => col.slug === collectionSlug);
    if (userCollection) {
      const userFieldNames = userCollection.fields?.map(field => field.name) || [];
      const requiredFieldNames = requiredFields[collectionSlug] || [];
      const missing = requiredFieldNames.filter(
        fieldName => !userFieldNames.includes(fieldName)
      );
      if (missing.length > 0) {
        missingFields[collectionSlug] = missing;
      }
    }
  });

  return {
    isCompatible: missingCollections.length === 0 && Object.keys(missingFields).length === 0,
    missingCollections,
    missingFields
  };
};

export default templates;
