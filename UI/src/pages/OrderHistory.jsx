import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Trash2, 
  ChevronDown, 
  AlertCircle,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Eye,
  RefreshCw,
  ShoppingCart,
  MapPin,
  CreditCard,
  FileText,
  Download,
  Share2,
  Star,
  MessageCircle
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('all');
  const [sortPrice, setSortPrice] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

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

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order => 
        (order.orderNumber || order.id).toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some(item => 
          (item.name || item.productName || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => {
        const orderStatus = (order.status || '').toLowerCase();
        return orderStatus === statusFilter;
      });
    }

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
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-300';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'approved':
      case 'delivered': 
        return 'bg-green-50 text-green-800 border-green-200';
      case 'shipped': 
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'pending':
      case 'awaiting_approval':
      case 'processing':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'failed':
        return 'bg-red-50 text-red-800 border-red-200';
      default: 
        return 'bg-gray-50 text-gray-800 border-gray-200';
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
    if (order.totalAmount !== undefined) {
      return order.totalAmount;
    }
    
    if (order.items && Array.isArray(order.items)) {
      const itemsTotal = order.items.reduce((total, item) => {
        const price = item.price || item.unitPrice || 0;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
      }, 0);
      
      const shippingFee = order.shippingFee || order.transportFee || 0;
      return itemsTotal + shippingFee;
    }
    
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
        const response = await fetch(`http://localhost:8082/api/orders/${orderId}/cancel`, {
          method: 'PUT',
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

        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        
      } catch (error) {
        console.error('Error deleting order:', error);
        alert(error.message || 'Failed to delete order. Please try again.');
      }
    }
  };

  const handleBuyAgain = (order) => {
    const itemsToAdd = order.items || [];
    if (itemsToAdd.length > 0) {
      alert(`Adding ${itemsToAdd.length} items from order #${order.orderNumber || order.id} to cart`);
    } else {
      alert('No items found in this order');
    }
  };

  const handleTrackOrder = (order) => {
    const trackingNumber = order.trackingNumber || order.id;
    alert(`Tracking information for order #${order.orderNumber || order.id}\nTracking Number: ${trackingNumber}\nStatus: ${getStatusText(order.status)}`);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
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

  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;

    const orderTotal = calculateOrderTotal(order);
    const shippingFee = order.shippingFee || order.transportFee || 0;
    const subtotal = orderTotal - shippingFee;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Order Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Order Information</h3>
                <p className="text-sm text-gray-600">#{order.orderNumber || order.id}</p>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt || order.date)}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name || item.productName || 'Unknown Item'}</p>
                        <div className="flex gap-2 text-sm text-gray-600">
                          {item.quantity && <span>Qty: {item.quantity}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">Rs {((item.price || item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Rs {(item.price || item.unitPrice || 0).toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">Rs {subtotal.toFixed(2)}</span>
                </div>
                {shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="text-gray-900">Rs {shippingFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600">Rs {orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.paymentMethod && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </h4>
                  <p className="text-gray-600">{getPaymentMethodText(order.paymentMethod)}</p>
                </div>
              )}
              {order.shippingAddress && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h4>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button 
              onClick={() => handleBuyAgain(order)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Buy Again
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              {error.includes('login') && (
                <button 
                  onClick={handleLoginRedirect}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Order History</h1>
                <p className="text-blue-100 text-lg">
                  {user ? `Welcome back, ${user.name || user.email}` : 'View your past orders and track shipments'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-100">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        {orders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Date Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowDateMenu(!showDateMenu)}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    {filterDate === 'all' && 'All Time'}
                    {filterDate === 'today' && 'Today'}
                    {filterDate === '7days' && 'Last 7 Days'}
                    {filterDate === '30days' && 'Last 30 Days'}
                    <ChevronDown size={16} />
                  </button>
                  {showDateMenu && (
                    <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      {['all', 'today', '7days', '30days'].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterDate(option);
                            setShowDateMenu(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
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

                {/* Status Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Filter className="h-4 w-4" />
                    {statusFilter === 'all' && 'All Status'}
                    {statusFilter === 'pending' && 'Pending'}
                    {statusFilter === 'shipped' && 'Shipped'}
                    {statusFilter === 'delivered' && 'Delivered'}
                    {statusFilter === 'cancelled' && 'Cancelled'}
                    <ChevronDown size={16} />
                  </button>
                  {showStatusMenu && (
                    <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setStatusFilter(option);
                            setShowStatusMenu(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          {option === 'all' && 'All Status'}
                          {option === 'pending' && 'Pending'}
                          {option === 'shipped' && 'Shipped'}
                          {option === 'delivered' && 'Delivered'}
                          {option === 'cancelled' && 'Cancelled'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort by Price */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <DollarSign className="h-4 w-4" />
                    {sortPrice === 'default' && 'Sort by Price'}
                    {sortPrice === 'high' && 'High to Low'}
                    {sortPrice === 'low' && 'Low to High'}
                    <ChevronDown size={16} />
                  </button>
                  {showSortMenu && (
                    <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      {['default', 'high', 'low'].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortPrice(option);
                            setShowSortMenu(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
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
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {orders.length === 0 
                  ? 'Your orders will appear here once you make a purchase' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {orders.length === 0 && (
                <Link to="/categories" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <ShoppingCart className="h-4 w-4" />
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const orderTotal = calculateOrderTotal(order);
                const orderId = order.orderNumber || order.id;
                const shippingFee = order.shippingFee || order.transportFee || 0;
                const subtotal = orderTotal - shippingFee;
                
                return (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors group">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Order #{orderId}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Placed on {formatDate(order.createdAt || order.date)}
                            </p>
                            {order.paymentMethod && (
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                {getPaymentMethodText(order.paymentMethod)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                              title="Delete order"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="space-y-2">
                          {order.items?.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">
                                {item.quantity || 1}x {item.name || item.productName || 'Unknown Item'}
                              </span>
                              <span className="text-gray-900 font-medium">
                                Rs {(((item.price || item.unitPrice || 0) * (item.quantity || 1))).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {order.items && order.items.length > 2 && (
                            <p className="text-sm text-gray-500">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                          <span className="text-gray-600">Total Amount</span>
                          <span className="text-xl font-bold text-blue-600">Rs {orderTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                        {order.status && !['cancelled', 'failed'].includes(order.status.toLowerCase()) && (
                          <button 
                            onClick={() => handleTrackOrder(order)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            <Truck className="h-4 w-4" />
                            Track Order
                          </button>
                        )}
                        <button 
                          onClick={() => handleBuyAgain(order)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Buy Again
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && (
        <OrderModal 
          order={selectedOrder} 
          onClose={() => setShowOrderModal(false)} 
        />
      )}
    </div>
  );
};

export default Orders;