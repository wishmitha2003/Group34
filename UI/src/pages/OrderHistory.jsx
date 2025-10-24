import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Trash2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { orders: authOrders, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('all');
  const [sortPrice, setSortPrice] = useState('default');
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Load orders from localStorage directly and sync with auth context
  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          // Filter orders for current user if user is logged in
          const userOrders = user ? parsedOrders.filter(order => 
            order.shippingInfo && order.shippingInfo.fullName === user.name
          ) : parsedOrders;
          
          setOrders(userOrders);
        } else {
          setOrders(authOrders || []);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders(authOrders || []);
      }
    };

    loadOrders();

    // Listen for storage changes and custom events
    const handleStorageChange = () => {
      loadOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ordersUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ordersUpdated', handleStorageChange);
    };
  }, [authOrders, user]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...orders];

    // Filter by date
    const now = new Date();
    if (filterDate !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
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
        const totalA = a.finalTotal || calculateOrderTotal(a);
        const totalB = b.finalTotal || calculateOrderTotal(b);
        return sortPrice === 'high' ? totalB - totalA : totalA - totalB;
      });
    }

    setOrders(filtered);
  }, [orders, filterDate, sortPrice]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'delivered': 
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped': 
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'awaiting_approval':
        return <Package className="h-5 w-5 text-yellow-600" />;
      default: 
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'delivered': 
        return 'bg-green-100 text-green-800';
      case 'shipped': 
        return 'bg-blue-100 text-blue-800';
      case 'awaiting_approval':
        return 'bg-yellow-100 text-yellow-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'approved': return 'Approved';
      case 'awaiting_approval': return 'Awaiting Approval';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const calculateOrderTotal = (order) => {
    if (order.finalTotal) {
      return order.finalTotal;
    }
    if (order.totalPrice && order.transportFee) {
      return order.totalPrice + order.transportFee;
    }
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Delete order from localStorage and state
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          const updatedOrders = orders.filter(order => order.id !== orderId);
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          
          // Update local state
          setOrders(updatedOrders);
          
          // Dispatch event to notify other components
          window.dispatchEvent(new Event('ordersUpdated'));
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleBuyAgain = (order) => {
    // This would typically add items to cart
    alert('This would add all items from this order to your cart');
  };

  const handleTrackOrder = (order) => {
    alert(`Tracking information for order #${order.id} would appear here`);
  };

  const handleViewDetails = (order) => {
    alert(`Order details for #${order.id}:\n\nItems: ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}\nTotal: Rs ${calculateOrderTotal(order).toFixed(2)}`);
  };

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
              <p className="text-gray-600">View your past orders and track shipments</p>
            </div>
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
          </div>
        </div>
        
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Your orders will appear here once you make a purchase</p>
              <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const orderTotal = calculateOrderTotal(order);
                
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
                        <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                        </p>
                        {order.paymentMethod && (
                          <p className="text-sm text-gray-500">
                            Payment: {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 
                                    order.paymentMethod === 'bank_slip' ? 'Bank Transfer' : 
                                    'Credit Card'}
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
                            <span className="text-gray-700">{item.quantity}x {item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-900">Rs {(item.price * item.quantity).toFixed(2)}</span>
                            <div className="text-sm text-gray-500">Rs {item.price.toFixed(2)} each</div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Transport Fee */}
                      {order.transportFee > 0 && (
                        <div className="flex justify-between items-center py-2 border-t">
                          <div className="flex-1">
                            <span className="text-gray-700">Transport Fee</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-900">Rs {order.transportFee.toFixed(2)}</span>
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
                    
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleTrackOrder(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Track Order
                      </button>
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