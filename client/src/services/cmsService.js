import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class CMSService {
  // Collections
  async getCollections() {
    const response = await axios.get(`${API_URL}/collections`);
    return response.data;
  }

  async getCollection(id) {
    const response = await axios.get(`${API_URL}/collections/${id}`);
    return response.data;
  }

  async createCollection(data) {
    const response = await axios.post(`${API_URL}/collections`, data);
    return response.data;
  }

  async updateCollection(id, data) {
    const response = await axios.put(`${API_URL}/collections/${id}`, data);
    return response.data;
  }

  async deleteCollection(id) {
    const response = await axios.delete(`${API_URL}/collections/${id}`);
    return response.data;
  }

  async getCollectionStats(id) {
    const response = await axios.get(`${API_URL}/collections/${id}/stats`);
    return response.data;
  }

  // Content
  async getContent(collectionId, params = {}) {
    const response = await axios.get(`${API_URL}/content/collection/${collectionId}`, { params });
    return response.data;
  }

  async getContentItem(id) {
    const response = await axios.get(`${API_URL}/content/${id}`);
    return response.data;
  }

  async createContent(data) {
    const response = await axios.post(`${API_URL}/content`, data);
    return response.data;
  }

  async updateContent(id, data) {
    const response = await axios.put(`${API_URL}/content/${id}`, data);
    return response.data;
  }

  async deleteContent(id) {
    const response = await axios.delete(`${API_URL}/content/${id}`);
    return response.data;
  }

  async publishContent(id, publish) {
    const response = await axios.patch(`${API_URL}/content/${id}/publish`, { publish });
    return response.data;
  }

  async getPublicContent(collectionSlug, contentSlug) {
    const response = await axios.get(`${API_URL}/content/public/${collectionSlug}/${contentSlug}`);
    return response.data;
  }

  // Media
  async getMedia(params = {}) {
    const response = await axios.get(`${API_URL}/media`, { params });
    return response.data;
  }

  async uploadMedia(file, metadata = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const response = await axios.post(`${API_URL}/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadMultipleMedia(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await axios.post(`${API_URL}/media/upload-multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateMedia(id, data) {
    const response = await axios.put(`${API_URL}/media/${id}`, data);
    return response.data;
  }

  async deleteMedia(id) {
    const response = await axios.delete(`${API_URL}/media/${id}`);
    return response.data;
  }

  // GraphQL
  async graphqlQuery(query, variables = {}) {
    const response = await axios.post(`${API_URL}/graphql`, {
      query,
      variables
    });
    return response.data;
  }

  // Predefined collection templates
  getBlogTemplate() {
    return {
      name: 'Blog Posts',
      description: 'Blog articles and posts',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Excerpt',
          required: false
        },
        {
          name: 'content',
          type: 'richtext',
          label: 'Content',
          required: true
        },
        {
          name: 'featuredImage',
          type: 'image',
          label: 'Featured Image',
          required: false
        },
        {
          name: 'author',
          type: 'text',
          label: 'Author',
          required: true
        },
        {
          name: 'publishDate',
          type: 'date',
          label: 'Publish Date',
          required: true
        },
        {
          name: 'category',
          type: 'select',
          label: 'Category',
          required: true,
          options: ['Technology', 'Business', 'Lifestyle', 'Travel', 'Food']
        },
        {
          name: 'tags',
          type: 'multiselect',
          label: 'Tags',
          required: false,
          options: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Tutorial', 'Guide']
        }
      ]
    };
  }

  getProductTemplate() {
    return {
      name: 'Products',
      description: 'E-commerce product catalog',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Product Name',
          required: true
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true
        },
        {
          name: 'price',
          type: 'number',
          label: 'Price',
          required: true,
          validation: { min: 0 }
        },
        {
          name: 'salePrice',
          type: 'number',
          label: 'Sale Price',
          required: false,
          validation: { min: 0 }
        },
        {
          name: 'images',
          type: 'multiselect',
          label: 'Product Images',
          required: true
        },
        {
          name: 'category',
          type: 'select',
          label: 'Category',
          required: true,
          options: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books']
        },
        {
          name: 'inStock',
          type: 'boolean',
          label: 'In Stock',
          required: true
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
          required: true
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Weight (kg)',
          required: false,
          validation: { min: 0 }
        }
      ]
    };
  }

  getPortfolioTemplate() {
    return {
      name: 'Portfolio',
      description: 'Portfolio projects and work',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Project Title',
          required: true
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true
        },
        {
          name: 'images',
          type: 'multiselect',
          label: 'Project Images',
          required: true
        },
        {
          name: 'client',
          type: 'text',
          label: 'Client',
          required: false
        },
        {
          name: 'projectUrl',
          type: 'url',
          label: 'Project URL',
          required: false
        },
        {
          name: 'technologies',
          type: 'multiselect',
          label: 'Technologies',
          required: true,
          options: ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'PHP', 'WordPress', 'Shopify']
        },
        {
          name: 'completedDate',
          type: 'date',
          label: 'Completion Date',
          required: true
        },
        {
          name: 'featured',
          type: 'boolean',
          label: 'Featured Project',
          required: false
        }
      ]
    };
  }
}

export default new CMSService();
