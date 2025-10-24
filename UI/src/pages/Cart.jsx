import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, MinusIcon, TrashIcon, ArrowLeftIcon, ShoppingBagIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  // Safe category formatting function
  const formatCategory = (category) => {
    if (!category) return 'General';
    return category.replace(/-/g, ' ');
  };

  // Safe image URL handling
  const getSafeImageUrl = (image) => {
    if (!image) return '/placeholder-image.jpg';
    return image;
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link
          to="/"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header (hidden on mobile) */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b">
              <div className="col-span-6">
                <span className="font-semibold">Product</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-semibold">Price</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-semibold">Quantity</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-semibold">Total</span>
              </div>
            </div>

            {/* Cart Items List */}
            {cart.map(item => (
              <div key={item.id} className="border-b last:border-b-0 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center space-x-4">
                    <img
                      src={getSafeImageUrl(item.image)}
                      alt={item.name || 'Product'}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div>
                      <h3 className="font-medium">{item.name || 'Unnamed Product'}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {formatCategory(item.category)}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center">
                    <span className="md:hidden font-medium mr-2">Price:</span>
                    <span>Rs {(item.price || 0).toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, (item.quantity || 1) - 1))}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={!item.quantity || item.quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 0) + 1)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-around">
                    <div>
                      <span className="md:hidden font-medium mr-2">Total:</span>
                      <span className="font-medium">
                        Rs {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="p-4 flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({totalItems || 0})</span>
                <span>Rs {(totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>Rs {(totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Proceed to Checkout
            </button>
            <div className="mt-4">
              <Link
                to="/"
                className="flex items-center justify-center text-blue-600 hover:text-blue-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;