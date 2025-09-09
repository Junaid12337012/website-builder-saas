// Blog page templates with CMS bindings
export const blogTemplates = {
  blogList: {
    name: 'Blog List Page',
    description: 'A page that displays a list of blog posts from your CMS',
    thumbnail: '/templates/blog-list.png',
    elements: [
      // Header Section
      {
        id: 'blog-header-1',
        type: 'section',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 1200, height: 200 },
        styles: {
          backgroundColor: '#1f2937',
          padding: '60px 40px',
          textAlign: 'center'
        },
        children: [
          {
            id: 'blog-title-1',
            type: 'text',
            position: { x: 400, y: 60, z: 2 },
            dimensions: { width: 400, height: 80 },
            content: { text: 'Our Blog' },
            styles: {
              fontSize: '48px',
              fontWeight: '700',
              color: '#ffffff',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }
          }
        ]
      },
      // Blog Posts List
      {
        id: 'blog-list-1',
        type: 'list',
        position: { x: 100, y: 250, z: 1 },
        dimensions: { width: 1000, height: 600 },
        content: {
          maxItems: 6,
          showHeader: false,
          layout: 'grid'
        },
        styles: {
          backgroundColor: 'transparent',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        },
        cmsBinding: {
          type: 'cms',
          collectionSlug: 'blog',
          bindToCollection: true
        }
      }
    ],
    cmsRequirements: {
      collections: ['blog'],
      fields: {
        blog: ['title', 'excerpt', 'featuredImage', 'publishedAt', 'author']
      }
    }
  },

  blogPost: {
    name: 'Blog Post Page',
    description: 'A detailed blog post page with CMS content binding',
    thumbnail: '/templates/blog-post.png',
    elements: [
      // Hero Section
      {
        id: 'post-hero-1',
        type: 'section',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 1200, height: 400 },
        styles: {
          backgroundColor: '#f9fafb',
          padding: '80px 40px',
          textAlign: 'center'
        },
        children: [
          // Featured Image
          {
            id: 'post-image-1',
            type: 'image',
            position: { x: 300, y: 40, z: 2 },
            dimensions: { width: 600, height: 300 },
            content: {
              src: 'https://via.placeholder.com/600x300?text=Featured+Image',
              alt: 'Blog post featured image'
            },
            styles: {
              borderRadius: '12px',
              objectFit: 'cover'
            },
            cmsBinding: {
              type: 'cms',
              field: 'featuredImage'
            }
          }
        ]
      },
      // Title and Meta
      {
        id: 'post-title-1',
        type: 'text',
        position: { x: 200, y: 450, z: 1 },
        dimensions: { width: 800, height: 120 },
        content: { text: 'Blog Post Title' },
        styles: {
          fontSize: '42px',
          fontWeight: '700',
          color: '#111827',
          textAlign: 'center',
          lineHeight: '1.2',
          fontFamily: 'Inter, sans-serif'
        },
        cmsBinding: {
          type: 'cms',
          field: 'title'
        }
      },
      // Author and Date
      {
        id: 'post-meta-1',
        type: 'text',
        position: { x: 400, y: 590, z: 1 },
        dimensions: { width: 400, height: 40 },
        content: { text: 'By Author Name • Published Date' },
        styles: {
          fontSize: '16px',
          color: '#6b7280',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        },
        cmsBinding: {
          type: 'cms',
          field: 'author'
        }
      },
      // Content
      {
        id: 'post-content-1',
        type: 'text',
        position: { x: 200, y: 680, z: 1 },
        dimensions: { width: 800, height: 400 },
        content: { text: 'Blog post content will appear here...' },
        styles: {
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        },
        cmsBinding: {
          type: 'cms',
          field: 'content'
        }
      }
    ],
    cmsRequirements: {
      collections: ['blog'],
      fields: {
        blog: ['title', 'content', 'featuredImage', 'author', 'publishedAt']
      }
    }
  },

  blogCard: {
    name: 'Blog Card Component',
    description: 'Reusable blog post card for lists and grids',
    thumbnail: '/templates/blog-card.png',
    elements: [
      {
        id: 'card-container-1',
        type: 'section',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 350, height: 400 },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '0px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        children: [
          // Card Image
          {
            id: 'card-image-1',
            type: 'image',
            position: { x: 0, y: 0, z: 2 },
            dimensions: { width: 350, height: 200 },
            content: {
              src: 'https://via.placeholder.com/350x200?text=Blog+Image',
              alt: 'Blog post image'
            },
            styles: {
              borderRadius: '12px 12px 0 0',
              objectFit: 'cover'
            },
            cmsBinding: {
              type: 'cms',
              field: 'featuredImage'
            }
          },
          // Card Title
          {
            id: 'card-title-1',
            type: 'text',
            position: { x: 20, y: 220, z: 2 },
            dimensions: { width: 310, height: 80 },
            content: { text: 'Blog Post Title' },
            styles: {
              fontSize: '20px',
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
          // Card Excerpt
          {
            id: 'card-excerpt-1',
            type: 'text',
            position: { x: 20, y: 310, z: 2 },
            dimensions: { width: 310, height: 60 },
            content: { text: 'Blog post excerpt or description...' },
            styles: {
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.5',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'excerpt'
            }
          }
        ]
      }
    ],
    cmsRequirements: {
      collections: ['blog'],
      fields: {
        blog: ['title', 'excerpt', 'featuredImage']
      }
    }
  }
};

export default blogTemplates;
