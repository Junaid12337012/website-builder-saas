// Portfolio page templates with CMS bindings
export const portfolioTemplates = {
  portfolioGrid: {
    name: 'Portfolio Grid Page',
    description: 'A masonry-style grid showcasing portfolio projects',
    thumbnail: '/templates/portfolio-grid.png',
    elements: [
      // Hero Section
      {
        id: 'portfolio-hero-1',
        type: 'section',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 1200, height: 300 },
        styles: {
          backgroundColor: '#111827',
          padding: '80px 40px',
          textAlign: 'center'
        },
        children: [
          {
            id: 'portfolio-title-1',
            type: 'text',
            position: { x: 300, y: 60, z: 2 },
            dimensions: { width: 600, height: 80 },
            content: { text: 'My Portfolio' },
            styles: {
              fontSize: '48px',
              fontWeight: '700',
              color: '#ffffff',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }
          },
          {
            id: 'portfolio-subtitle-1',
            type: 'text',
            position: { x: 350, y: 150, z: 2 },
            dimensions: { width: 500, height: 60 },
            content: { text: 'Showcasing my creative work and projects' },
            styles: {
              fontSize: '18px',
              color: '#d1d5db',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }
          }
        ]
      },
      // Portfolio Grid
      {
        id: 'portfolio-grid-1',
        type: 'list',
        position: { x: 100, y: 350, z: 1 },
        dimensions: { width: 1000, height: 800 },
        content: {
          maxItems: 12,
          showHeader: false,
          layout: 'masonry'
        },
        styles: {
          backgroundColor: 'transparent',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        },
        cmsBinding: {
          type: 'cms',
          collectionSlug: 'portfolio',
          bindToCollection: true
        }
      }
    ],
    cmsRequirements: {
      collections: ['portfolio'],
      fields: {
        portfolio: ['title', 'description', 'image', 'category', 'technologies', 'projectUrl']
      }
    }
  },

  portfolioDetail: {
    name: 'Portfolio Project Detail',
    description: 'Detailed view of a single portfolio project',
    thumbnail: '/templates/portfolio-detail.png',
    elements: [
      // Project Hero Image
      {
        id: 'project-hero-1',
        type: 'image',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 1200, height: 500 },
        content: {
          src: 'https://via.placeholder.com/1200x500?text=Project+Hero+Image',
          alt: 'Project hero image'
        },
        styles: {
          objectFit: 'cover',
          width: '100%'
        },
        cmsBinding: {
          type: 'cms',
          field: 'image'
        }
      },
      // Project Info Section
      {
        id: 'project-info-1',
        type: 'section',
        position: { x: 200, y: 550, z: 1 },
        dimensions: { width: 800, height: 400 },
        styles: {
          backgroundColor: 'transparent',
          padding: '40px 0'
        },
        children: [
          // Project Title
          {
            id: 'project-title-1',
            type: 'text',
            position: { x: 0, y: 0, z: 2 },
            dimensions: { width: 800, height: 80 },
            content: { text: 'Project Title' },
            styles: {
              fontSize: '42px',
              fontWeight: '700',
              color: '#111827',
              lineHeight: '1.2',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'title'
            }
          },
          // Project Category
          {
            id: 'project-category-1',
            type: 'text',
            position: { x: 0, y: 90, z: 2 },
            dimensions: { width: 200, height: 40 },
            content: { text: 'Category' },
            styles: {
              fontSize: '16px',
              fontWeight: '500',
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'category'
            }
          },
          // Project Description
          {
            id: 'project-description-1',
            type: 'text',
            position: { x: 0, y: 150, z: 2 },
            dimensions: { width: 800, height: 150 },
            content: { text: 'Project description and details will appear here...' },
            styles: {
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#374151',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'description'
            }
          },
          // Technologies Used
          {
            id: 'project-technologies-1',
            type: 'text',
            position: { x: 0, y: 320, z: 2 },
            dimensions: { width: 400, height: 60 },
            content: { text: 'Technologies: React, Node.js, MongoDB' },
            styles: {
              fontSize: '16px',
              color: '#6b7280',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'technologies'
            }
          },
          // View Project Button
          {
            id: 'project-link-1',
            type: 'button',
            position: { x: 450, y: 320, z: 2 },
            dimensions: { width: 150, height: 50 },
            content: { text: 'View Project', href: '#' },
            styles: {
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer'
            },
            cmsBinding: {
              type: 'cms',
              field: 'projectUrl'
            }
          }
        ]
      }
    ],
    cmsRequirements: {
      collections: ['portfolio'],
      fields: {
        portfolio: ['title', 'description', 'image', 'category', 'technologies', 'projectUrl']
      }
    }
  },

  portfolioCard: {
    name: 'Portfolio Card Component',
    description: 'Reusable portfolio project card with hover effects',
    thumbnail: '/templates/portfolio-card.png',
    elements: [
      {
        id: 'portfolio-card-container-1',
        type: 'section',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 350, height: 450 },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '0px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          overflow: 'hidden'
        },
        children: [
          // Project Image
          {
            id: 'portfolio-card-image-1',
            type: 'image',
            position: { x: 0, y: 0, z: 2 },
            dimensions: { width: 350, height: 250 },
            content: {
              src: 'https://via.placeholder.com/350x250?text=Project+Image',
              alt: 'Portfolio project image'
            },
            styles: {
              objectFit: 'cover',
              transition: 'transform 0.3s'
            },
            cmsBinding: {
              type: 'cms',
              field: 'image'
            }
          },
          // Project Title
          {
            id: 'portfolio-card-title-1',
            type: 'text',
            position: { x: 20, y: 270, z: 2 },
            dimensions: { width: 310, height: 60 },
            content: { text: 'Project Title' },
            styles: {
              fontSize: '22px',
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.3',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'title'
            }
          },
          // Project Category
          {
            id: 'portfolio-card-category-1',
            type: 'text',
            position: { x: 20, y: 340, z: 2 },
            dimensions: { width: 150, height: 30 },
            content: { text: 'Category' },
            styles: {
              fontSize: '14px',
              fontWeight: '500',
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'category'
            }
          },
          // Project Description
          {
            id: 'portfolio-card-description-1',
            type: 'text',
            position: { x: 20, y: 380, z: 2 },
            dimensions: { width: 310, height: 50 },
            content: { text: 'Brief project description...' },
            styles: {
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.4',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'description'
            }
          }
        ]
      }
    ],
    cmsRequirements: {
      collections: ['portfolio'],
      fields: {
        portfolio: ['title', 'description', 'image', 'category']
      }
    }
  }
};

export default portfolioTemplates;
