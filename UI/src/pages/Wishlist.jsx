import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext'; // Use WishlistContext instead of AuthContext
import { useCart } from '../context/CartContext'; // Import CartContext for adding to cart

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist(); // Get from WishlistContext
  const { addToCart } = useCart(); // Get addToCart function from CartContext

  const handleAddToCart = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add item to cart with quantity 1
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      category: item.category
    });
    
    // Optional: Show success message or notification
    console.log('Added to cart:', item.name);
  };

  const handleRemove = (itemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(itemId);
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length > 0) {
      if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
        clearWishlist();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-50 p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length === 0 
                  ? 'Your saved items for later' 
                  : `${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist`
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              {wishlistItems.length > 0 && (
                <button 
                  onClick={handleClearWishlist}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              )}
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-4">Save items you love for later by clicking the heart icon</p>
              <Link 
                to="/" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div 
                  key={item.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-blue-600">Rs {item.price.toFixed(2)}</span>
                      <span className="text-sm text-green-600 font-medium">In Stock</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleAddToCart(item, e)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button 
                        onClick={(e) => handleRemove(item.id, e)}
                        className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;