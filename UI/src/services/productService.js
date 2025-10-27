import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8082', // base URL for all requests
});

// Axios interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productService = {
  // 🔹 Add a new product (admin only)
  addProduct: async (productData) => {
    try {
      const response = await api.post('/products/admin/add', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // 🔹 Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // 🔹 Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // 🔹 Update a product (admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/admin/update/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // 🔹 Delete a product (admin only)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/admin/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // 🔹 Search products by name
  searchProducts: async (name) => {
    try {
      const response = await api.get(`/products/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // 🔹 Filter products by category
  filterByCategory: async (category) => {
    try {
      const response = await api.get(`/products/filter?category=${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering products by category:', error);
      throw error;
    }
  },
};

export default productService;
