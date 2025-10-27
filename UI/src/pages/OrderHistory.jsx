import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Trash2, ChevronDown, AlertCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('all');
  const [sortPrice, setSortPrice] = useState('default');
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Get token and user from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      const token = getAuthToken();
      const userInfo = getUserInfo();
      
      setUser(userInfo);

      if (!token) {
        setLoading(false);
        setError('Please login to view your orders');
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:8082/api/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const ordersData = await response.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Failed to load orders. Please try again.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters and sorting
  const getFilteredAndSortedOrders = () => {
    let filtered = [...orders];

    // Filter by date
    const now = new Date();
    if (filterDate !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt || order.date);
        const diffTime = now - orderDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (filterDate === 'today') return diffDays === 0;
        if (filterDate === '7days') return diffDays <= 7;
        if (filterDate === '30days') return diffDays <= 30;
        return true;
      });
    }

    // Sort by price
    if (sortPrice !== 'default') {
      filtered.sort((a, b) => {
        const totalA = calculateOrderTotal(a);
        const totalB = calculateOrderTotal(b);
        return sortPrice === 'high' ? totalB - totalA : totalA - totalB;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredAndSortedOrders();

  const getStatusIcon = (status) => {
    if (!status) return <Package className="h-5 w-5 text-gray-600" />;
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'approved':
      case 'delivered': 
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped': 
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'pending':
      case 'awaiting_approval':
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: 
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'approved':
      case 'delivered': 
        return 'bg-green-100 text-green-800';
      case 'shipped': 
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'awaiting_approval':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Unknown';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed': return 'Completed';
      case 'approved': return 'Approved';
      case 'pending': 
      case 'awaiting_approval': 
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'failed': return 'Failed';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const calculateOrderTotal = (order) => {
    // If API returns total amount directly
    if (order.totalAmount !== undefined) {
      return order.totalAmount;
    }
    
    // If API returns items array, calculate from items
    if (order.items && Array.isArray(order.items)) {
      const itemsTotal = order.items.reduce((total, item) => {
        const price = item.price || item.unitPrice || 0;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
      }, 0);
      
      // Add shipping fee if available
      const shippingFee = order.shippingFee || order.transportFee || 0;
      return itemsTotal + shippingFee;
    }
    
    // Fallback to finalTotal or default to 0
    return order.finalTotal || order.total || 0;
  };

  // Delete order via API
  const handleDeleteOrder = async (orderId) => {
    const token = getAuthToken();
    
    if (!token) {
      alert('Please login to delete orders');
      return;
    }

    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`http://localhost:8082/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }

        if (!response.ok) {
          throw new Error('Failed to delete order');
        }

        // Remove order from local state
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        
      } catch (error) {
        console.error('Error deleting order:', error);
        alert(error.message || 'Failed to delete order. Please try again.');
      }
    }
  };

  const handleBuyAgain = (order) => {
    // This would typically add items to cart
    const itemsToAdd = order.items || [];
    if (itemsToAdd.length > 0) {
      // Here you would implement adding to cart logic
      alert(`Adding ${itemsToAdd.length} items from order #${order.orderNumber || order.id} to cart`);
      // Example: addToCart(itemsToAdd);
    } else {
      alert('No items found in this order');
    }
  };

  const handleTrackOrder = (order) => {
    const trackingNumber = order.trackingNumber || order.id;
    alert(`Tracking information for order #${order.orderNumber || order.id}\nTracking Number: ${trackingNumber}\nStatus: ${getStatusText(order.status)}`);
  };

  const handleViewDetails = (order) => {
    const itemsText = order.items && order.items.length > 0 
      ? order.items.map(item => 
          `${item.quantity || 1}x ${item.name || item.productName || 'Unknown Item'}`
        ).join('\n')
      : 'No items information available';
    
    const orderDetails = `
Order #${order.orderNumber || order.id}
Status: ${getStatusText(order.status)}
Date: ${formatDate(order.createdAt || order.date)}
Payment Method: ${getPaymentMethodText(order.paymentMethod)}

Items:
${itemsText}

Subtotal: Rs ${calculateOrderTotal(order).toFixed(2)}
Shipping: Rs ${(order.shippingFee || order.transportFee || 0).toFixed(2)}
Total: Rs ${calculateOrderTotal(order).toFixed(2)}
    `.trim();

    alert(orderDetails);
  };

  const getPaymentMethodText = (method) => {
    if (!method) return 'Unknown';
    
    switch (method.toLowerCase()) {
      case 'cash_on_delivery': return 'Cash on Delivery';
      case 'bank_transfer': return 'Bank Transfer';
      case 'credit_card': return 'Credit Card';
      case 'debit_card': return 'Debit Card';
      case 'online': return 'Online Payment';
      default: return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'Invalid date' 
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            {error.includes('login') && (
              <button 
                onClick={handleLoginRedirect}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-50 p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
              <p className="text-gray-600">
                {user ? `Welcome back, ${user.name || user.email}` : 'View your past orders and track shipments'}
              </p>
            </div>
            {filteredOrders.length > 0 && (
              <div className="flex gap-2">
                {/* Date Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowDateMenu(!showDateMenu)}
                    className="flex items-center gap-1 px-4 py-2 bg-white border rounded-md text-sm font-medium hover:bg-gray-50"
                  >
                    {filterDate === 'all' && 'All Time'}
                    {filterDate === 'today' && 'Today'}
                    {filterDate === '7days' && 'Last 7 Days'}
                    {filterDate === '30days' && 'Last 30 Days'}
                    <ChevronDown size={16} />
                  </button>
                  {showDateMenu && (
                    <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                      {['all', 'today', '7days', '30days'].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterDate(option);
                            setShowDateMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {option === 'all' && 'All Time'}
                          {option === 'today' && 'Today'}
                          {option === '7days' && 'Last 7 Days'}
                          {option === '30days' && 'Last 30 Days'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort by Price */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-1 px-4 py-2 bg-white border rounded-md text-sm font-medium hover:bg-gray-50"
                  >
                    {sortPrice === 'default' && 'Sort by Price'}
                    {sortPrice === 'high' && 'High to Low'}
                    {sortPrice === 'low' && 'Low to High'}
                    <ChevronDown size={16} />
                  </button>
                  {showSortMenu && (
                    <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                      {['default', 'high', 'low'].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortPrice(option);
                            setShowSortMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {option === 'default' && 'Default Order'}
                          {option === 'high' && 'High to Low'}
                          {option === 'low' && 'Low to High'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {orders.length === 0 
                  ? 'Your orders will appear here once you make a purchase' 
                  : 'Try changing your filter settings'
                }
              </p>
              {orders.length === 0 && (
                <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const orderTotal = calculateOrderTotal(order);
                const orderId = order.orderNumber || order.id;
                const shippingFee = order.shippingFee || order.transportFee || 0;
                const subtotal = orderTotal - shippingFee;
                
                return (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative group">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full"
                      title="Delete order"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>

                    <div className="flex items-center justify-between mb-4 pr-10">
                      <div>
                        <h3 className="font-semibold text-gray-800">Order #{orderId}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt || order.date)}
                        </p>
                        {order.paymentMethod && (
                          <p className="text-sm text-gray-500">
                            Payment: {getPaymentMethodText(order.paymentMethod)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <div className="flex-1">
                            <span className="text-gray-700">
                              {item.quantity || 1}x {item.name || item.productName || 'Unknown Item'}
                            </span>
                            {item.size && (
                              <span className="text-sm text-gray-500 ml-2">Size: {item.size}</span>
                            )}
                            {item.color && (
                              <span className="text-sm text-gray-500 ml-2">Color: {item.color}</span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-gray-900">
                              Rs {(((item.price || item.unitPrice || 0) * (item.quantity || 1))).toFixed(2)}
                            </span>
                            <div className="text-sm text-gray-500">
                              Rs {(item.price || item.unitPrice || 0).toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Shipping Fee */}
                      {shippingFee > 0 && (
                        <div className="flex justify-between items-center py-2 border-t">
                          <div className="flex-1">
                            <span className="text-gray-700">Shipping Fee</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-900">
                              Rs {shippingFee.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Total Amount</span>
                          <span className="text-blue-600">Rs {orderTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      {order.status && !['cancelled', 'failed'].includes(order.status.toLowerCase()) && (
                        <button 
                          onClick={() => handleTrackOrder(order)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Track Order
                        </button>
                      )}
                      <button 
                        onClick={() => handleBuyAgain(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;