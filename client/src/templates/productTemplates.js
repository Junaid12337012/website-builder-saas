// Product page templates with CMS bindings
export const productTemplates = {
  productGrid: {
    name: 'Product Grid Page',
    description: 'A grid layout displaying products from your CMS',
    thumbnail: '/templates/product-grid.png',
    elements: [
      // Header Section
      {
        id: 'products-header-1',
        type: 'section',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 1200, height: 180 },
        styles: {
          backgroundColor: '#ffffff',
          padding: '60px 40px',
          textAlign: 'center',
          borderBottom: '1px solid #e5e7eb'
        },
        children: [
          {
            id: 'products-title-1',
            type: 'text',
            position: { x: 400, y: 50, z: 2 },
            dimensions: { width: 400, height: 80 },
            content: { text: 'Our Products' },
            styles: {
              fontSize: '42px',
              fontWeight: '700',
              color: '#111827',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }
          }
        ]
      },
      // Products Grid
      {
        id: 'products-grid-1',
        type: 'list',
        position: { x: 100, y: 230, z: 1 },
        dimensions: { width: 1000, height: 800 },
        content: {
          maxItems: 12,
          showHeader: false,
          layout: 'grid'
        },
        styles: {
          backgroundColor: 'transparent',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        },
        cmsBinding: {
          type: 'cms',
          collectionSlug: 'products',
          bindToCollection: true
        }
      }
    ],
    cmsRequirements: {
      collections: ['products'],
      fields: {
        products: ['name', 'price', 'image', 'description', 'category']
      }
    }
  },

  productDetail: {
    name: 'Product Detail Page',
    description: 'Detailed product page with images, description, and purchase options',
    thumbnail: '/templates/product-detail.png',
    elements: [
      // Product Image
      {
        id: 'product-image-1',
        type: 'image',
        position: { x: 100, y: 100, z: 1 },
        dimensions: { width: 500, height: 500 },
        content: {
          src: 'https://via.placeholder.com/500x500?text=Product+Image',
          alt: 'Product image'
        },
        styles: {
          borderRadius: '12px',
          objectFit: 'cover',
          border: '1px solid #e5e7eb'
        },
        cmsBinding: {
          type: 'cms',
          field: 'image'
        }
      },
      // Product Info Section
      {
        id: 'product-info-1',
        type: 'section',
        position: { x: 650, y: 100, z: 1 },
        dimensions: { width: 450, height: 500 },
        styles: {
          backgroundColor: 'transparent',
          padding: '20px'
        },
        children: [
          // Product Name
          {
            id: 'product-name-1',
            type: 'text',
            position: { x: 0, y: 0, z: 2 },
            dimensions: { width: 410, height: 80 },
            content: { text: 'Product Name' },
            styles: {
              fontSize: '36px',
              fontWeight: '700',
              color: '#111827',
              lineHeight: '1.2',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'name'
            }
          },
          // Product Price
          {
            id: 'product-price-1',
            type: 'text',
            position: { x: 0, y: 100, z: 2 },
            dimensions: { width: 200, height: 50 },
            content: { text: '$99.99' },
            styles: {
              fontSize: '28px',
              fontWeight: '600',
              color: '#059669',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'price'
            }
          },
          // Product Description
          {
            id: 'product-description-1',
            type: 'text',
            position: { x: 0, y: 180, z: 2 },
            dimensions: { width: 410, height: 200 },
            content: { text: 'Product description and details will appear here...' },
            styles: {
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#374151',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'description'
            }
          },
          // Add to Cart Button
          {
            id: 'add-to-cart-1',
            type: 'button',
            position: { x: 0, y: 400, z: 2 },
            dimensions: { width: 200, height: 50 },
            content: { text: 'Add to Cart', href: '#' },
            styles: {
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer'
            }
          }
        ]
      }
    ],
    cmsRequirements: {
      collections: ['products'],
      fields: {
        products: ['name', 'price', 'image', 'description', 'category']
      }
    }
  },

  productCard: {
    name: 'Product Card Component',
    description: 'Reusable product card for grids and lists',
    thumbnail: '/templates/product-card.png',
    elements: [
      {
        id: 'product-card-container-1',
        type: 'section',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 280, height: 380 },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '0px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        },
        children: [
          // Product Image
          {
            id: 'product-card-image-1',
            type: 'image',
            position: { x: 0, y: 0, z: 2 },
            dimensions: { width: 280, height: 200 },
            content: {
              src: 'https://via.placeholder.com/280x200?text=Product',
              alt: 'Product image'
            },
            styles: {
              borderRadius: '12px 12px 0 0',
              objectFit: 'cover'
            },
            cmsBinding: {
              type: 'cms',
              field: 'image'
            }
          },
          // Product Name
          {
            id: 'product-card-name-1',
            type: 'text',
            position: { x: 16, y: 220, z: 2 },
            dimensions: { width: 248, height: 60 },
            content: { text: 'Product Name' },
            styles: {
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.3',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'name'
            }
          },
          // Product Price
          {
            id: 'product-card-price-1',
            type: 'text',
            position: { x: 16, y: 290, z: 2 },
            dimensions: { width: 120, height: 40 },
            content: { text: '$99.99' },
            styles: {
              fontSize: '20px',
              fontWeight: '700',
              color: '#059669',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'price'
            }
          },
          // Add to Cart Button
          {
            id: 'product-card-button-1',
            type: 'button',
            position: { x: 150, y: 290, z: 2 },
            dimensions: { width: 110, height: 36 },
            content: { text: 'Add to Cart', href: '#' },
            styles: {
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer'
            }
          }
        ]
      }
    ],
    cmsRequirements: {
      collections: ['products'],
      fields: {
        products: ['name', 'price', 'image']
      }
    }
  },

  productCategory: {
    name: 'Product Category Page',
    description: 'Category-filtered product listing with sidebar navigation',
    thumbnail: '/templates/product-category.png',
    elements: [
      // Category Sidebar
      {
        id: 'category-sidebar-1',
        type: 'section',
        position: { x: 0, y: 0, z: 1 },
        dimensions: { width: 250, height: 800 },
        styles: {
          backgroundColor: '#f9fafb',
          padding: '30px 20px',
          borderRight: '1px solid #e5e7eb'
        },
        children: [
          {
            id: 'category-title-1',
            type: 'text',
            position: { x: 0, y: 0, z: 2 },
            dimensions: { width: 210, height: 40 },
            content: { text: 'Categories' },
            styles: {
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              fontFamily: 'Inter, sans-serif'
            }
          }
        ]
      },
      // Main Content Area
      {
        id: 'category-content-1',
        type: 'section',
        position: { x: 250, y: 0, z: 1 },
        dimensions: { width: 950, height: 800 },
        styles: {
          backgroundColor: '#ffffff',
          padding: '30px'
        },
        children: [
          // Category Header
          {
            id: 'category-header-1',
            type: 'text',
            position: { x: 0, y: 0, z: 2 },
            dimensions: { width: 890, height: 60 },
            content: { text: 'Category Name' },
            styles: {
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              fontFamily: 'Inter, sans-serif'
            },
            cmsBinding: {
              type: 'cms',
              field: 'category'
            }
          },
          // Products Grid
          {
            id: 'category-products-1',
            type: 'list',
            position: { x: 0, y: 80, z: 2 },
            dimensions: { width: 890, height: 680 },
            content: {
              maxItems: 9,
              showHeader: false,
              layout: 'grid'
            },
            styles: {
              backgroundColor: 'transparent',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '25px'
            },
            cmsBinding: {
              type: 'cms',
              collectionSlug: 'products',
              bindToCollection: true,
              filter: { field: 'category', operator: 'equals' }
            }
          }
        ]
      }
    ],
    cmsRequirements: {
      collections: ['products'],
      fields: {
        products: ['name', 'price', 'image', 'category', 'description']
      }
    }
  }
};

export default productTemplates;
