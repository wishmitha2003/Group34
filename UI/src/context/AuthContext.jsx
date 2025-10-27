import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import api from '../utils/api';

// Fixed mock data for orders with correct totals
const mockOrders = [
  {
    id: 'ord-001',
    date: '2023-05-15',
    total: 124.99, // This should be 89.99 + 35.00 = 124.99 (correct)
    status: 'delivered',
    paymentMethod: 'Credit Card',
    items: [
      {
        id: 'prod-001',
        name: 'Cricket Bat - Premium',
        price: 89.99,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3',
      },
      {
        id: 'prod-002',
        name: 'Cricket Ball Set',
        price: 35.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.0.3',
      },
    ],
  },
  {
    id: 'ord-002',
    date: '2023-06-22',
    total: 69.5, // Fixed: 45.5 + (12.0 * 2) = 45.5 + 24 = 69.5 (was 78.5)
    status: 'delivered',
    paymentMethod: 'PayPal',
    items: [
      {
        id: 'prod-003',
        name: 'Football - Size 5',
        price: 45.5,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1614632537423-5e1c7618270d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3',
      },
      {
        id: 'prod-004',
        name: 'Football Socks',
        price: 12.0,
        quantity: 2,
        image:
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3',
      },
    ],
  },
];

const mockWishlist = [
  {
    id: 'prod-006',
    name: 'Premium Yoga Mat',
    price: 45.99,
    image:
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3',
    addedAt: '2023-07-12',
  },
  {
    id: 'prod-007',
    name: 'Table Tennis Set',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3',
    addedAt: '2023-08-05',
  },
];

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [wishlist, setWishlist] = useState(mockWishlist);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user, wishlist, and orders from localStorage on initial render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const authToken = localStorage.getItem('authToken');
      const savedWishlist = localStorage.getItem('wishlist');
      const savedOrders = localStorage.getItem('orders');

      // Check if both user data and auth token exist
      if (savedUser && authToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Validate user object structure
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      } else if (savedUser && !authToken) {
        // Clean up old localStorage data if token is missing
        localStorage.removeItem('user');
      }

      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          if (Array.isArray(parsedWishlist)) {
            setWishlist(parsedWishlist);
          }
        } catch (error) {
          console.error('Failed to parse wishlist from localStorage', error);
          localStorage.removeItem('wishlist');
        }
      }

      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders)) {
            setOrders(parsedOrders);
          }
        } catch (error) {
          console.error('Failed to parse orders from localStorage', error);
          localStorage.removeItem('orders');
        }
      }
    } catch (error) {
      console.error('Error initializing auth context', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Helper to save wishlist to localStorage
  const saveWishlist = (newWishlist) => {
    if (!Array.isArray(newWishlist)) {
      console.error('Wishlist must be an array');
      return;
    }
    setWishlist(newWishlist);
    try {
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage', error);
    }
  };

  // Helper to save orders to localStorage
  const saveOrders = (newOrders) => {
    if (!Array.isArray(newOrders)) {
      console.error('Orders must be an array');
      return;
    }
    setOrders(newOrders);
    try {
      localStorage.setItem('orders', JSON.stringify(newOrders));
    } catch (error) {
      console.error('Failed to save orders to localStorage', error);
    }
  };

  // Function to calculate order total from items
  const calculateOrderTotal = (items) => {
    if (!Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || 1;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const login = async (username, password) => {
    try {
      if (!username || !password) {
        console.error('Username and password are required');
        return false;
      }

      // Call backend API for login
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      });

      if (response.status === 200) {
        const data = response.data;
        
        // Store the JWT token
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Enhanced user info with additional fields for profile page
        const userInfo = {
          id: data.user?.id || String(Date.now()),
          username: data.user?.username || username,
          name: data.user?.fullName || data.user?.name || username,
          email: data.user?.email || '',
          phone: data.user?.phone || '',
          address: data.user?.address || null,
          profilePicture: data.user?.profilePicture || null,
          joinDate: data.user?.createdAt?.split('T')[0] || '2024',
          premium: data.user?.serviceType === 'Premium' || false,
          role: data.user?.role || 'USER',
          active: data.user?.active || true,
          available: data.user?.available || true
        };

        setUser(userInfo);
        setIsAuthenticated(true);
        
        try {
          localStorage.setItem('user', JSON.stringify(userInfo));
        } catch (error) {
          console.error('Failed to save user to localStorage', error);
        }

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error', error);
      
      if (error.response && error.response.data) {
        console.error('Login failed:', error.response.data);
      }
      
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      if (!userData?.username || !userData?.password) {
        console.error('Username and password are required for signup');
        return false;
      }

      const usersString = localStorage.getItem('users');
      const users = usersString ? JSON.parse(usersString) : [];
      
      if (users.some(u => u.username === userData.username)) {
        return false;
      }

      const newUser = {
        ...userData,
        id: String(users.length + 1),
        joinDate: new Date().toISOString().split('T')[0],
        premium: false,
      };
      users.push(newUser);
      
      try {
        localStorage.setItem('users', JSON.stringify(users));
      } catch (error) {
        console.error('Failed to save users to localStorage', error);
        return false;
      }

      // Enhanced user info for profile page
      const userInfo = {
        id: newUser.id,
        username: newUser.username,
        name: newUser?.fullName || newUser?.name || newUser.username,
        email: newUser?.email || '',
        phone: newUser?.phone || '',
        address: newUser?.address || null,
        profilePicture: newUser?.profilePicture || null,
        joinDate: newUser.joinDate,
        premium: newUser.premium,
      };

      setUser(userInfo);
      setIsAuthenticated(true);
      
      try {
        localStorage.setItem('user', JSON.stringify(userInfo));
      } catch (error) {
        console.error('Failed to save user to localStorage', error);
      }

      // Initialize empty wishlist for new user
      saveWishlist([]);

      return true;
    } catch (error) {
      console.error('Signup error', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Failed to remove user from localStorage', error);
    }
  };

  const updateProfile = async (userData) => {
    if (!user) return false;
    
    try {
      // Debug: Check if token exists
      const token = localStorage.getItem('authToken');
      console.log('Update Profile - JWT Token exists:', !!token);
      console.log('Update Profile - User ID:', user.id);
      console.log('Update Profile - Data:', userData);
      
      // Call backend API to update profile
      const response = await api.put(`/auth/profile/${user.id}`, {
        fullName: userData.name || userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        username: userData.username
      });

      if (response.status === 200) {
        // Update local user state with response data
        const updatedUser = {
          ...user,
          ...userData,
          name: userData?.name || userData?.fullName || user?.name || user?.fullName || 'User',
          // Update with backend response data
          fullName: response.data.user?.fullName || userData.name || userData.fullName,
          email: response.data.user?.email || userData.email,
          phone: response.data.user?.phone || userData.phone,
          address: response.data.user?.address || userData.address
        };
        
        setUser(updatedUser);
        
        try {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Failed to update user in localStorage', error);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update profile:', error);
      console.error('Update Profile Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      return false;
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return false;
    
    try {
      // Debug: Check if token exists
      const token = localStorage.getItem('authToken');
      console.log('JWT Token exists:', !!token);
      console.log('User ID:', user.id);
      
      // Call backend API to get latest profile data
      const response = await api.get(`/auth/profile/${user.id}`);
      
      if (response.status === 200) {
        const userData = response.data;
        const updatedUser = {
          ...user,
          name: userData.fullName || userData.name || user.name,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          username: userData.username,
          role: userData.role,
          active: userData.active,
          available: userData.available
        };
        
        setUser(updatedUser);
        
        try {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Failed to update user in localStorage', error);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      return false;
    }
  };

  const updateProfilePicture = async (imageUrl) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      profilePicture: imageUrl 
    };
    
    setUser(updatedUser);
    try {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update profile picture in localStorage', error);
    }
  };

  const addToWishlist = (item) => {
    if (!item?.id) {
      console.error('Cannot add item without id to wishlist');
      return;
    }

    const newItem = {
      id: item.id,
      name: item.name || 'Unknown Product',
      price: Number(item.price) || 0,
      image: item.image || '',
      addedAt: new Date().toISOString().split('T')[0],
      ...item
    };

    saveWishlist((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, newItem];
    });
  };

  const removeFromWishlist = (id) => {
    if (!id) {
      console.error('Cannot remove item without id from wishlist');
      return;
    }
    saveWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const addOrder = (newOrder) => {
    if (!newOrder?.id) {
      console.error('Cannot add order without id');
      return;
    }

    // Calculate the total from items to ensure accuracy
    const calculatedTotal = calculateOrderTotal(newOrder.items);

    const orderWithDefaults = {
      ...newOrder,
      date: newOrder.date || new Date().toISOString().split('T')[0],
      status: newOrder.status || 'processing',
      paymentMethod: newOrder.paymentMethod || 'Credit Card',
      total: calculatedTotal, // Always use calculated total
    };

    saveOrders((prev) => [orderWithDefaults, ...prev]);
  };

  // Function to fix existing orders with incorrect totals
  const fixOrderTotals = () => {
    const fixedOrders = orders.map(order => ({
      ...order,
      total: calculateOrderTotal(order.items)
    }));
    saveOrders(fixedOrders);
  };

  // Fix order totals on component mount if needed
  useEffect(() => {
    // Check if any orders have incorrect totals
    const hasIncorrectTotals = orders.some(order => {
      const calculatedTotal = calculateOrderTotal(order.items);
      return Math.abs(order.total - calculatedTotal) > 0.01; // Allow small floating point differences
    });

    if (hasIncorrectTotals) {
      fixOrderTotals();
    }
  }, []);

  // Provide loading state until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        orders,
        wishlist,
        login,
        signup,
        logout,
        updateProfile,
        refreshUserProfile,
        updateProfilePicture,
        addToWishlist,
        removeFromWishlist,
        addOrder,
        calculateOrderTotal, // Export this function if needed elsewhere
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};