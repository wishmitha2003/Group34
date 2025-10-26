import React, { useState } from 'react';
import { FileText, HeartIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  category,
  weight,
  middlePosition,
  concave,
  remainingStocks
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      quantity,
      category
    });

    setQuantity(1);

    const notification = document.getElementById(`notification-${id}`);
    if (notification) {
      notification.classList.remove('opacity-0', 'translate-y-2');
      notification.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        notification.classList.remove('opacity-100', 'translate-y-0');
        notification.classList.add('opacity-0', 'translate-y-2');
      }, 2000);
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, price, image, category });
    }

    const wishlistNotification = document.getElementById(`wishlist-notification-${id}`);
    if (wishlistNotification) {
      const action = isInWishlist(id) ? 'Removed from' : 'Added to';
      wishlistNotification.textContent = `${action} wishlist!`;
      
      wishlistNotification.classList.remove('opacity-0', 'translate-y-2');
      wishlistNotification.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        wishlistNotification.classList.remove('opacity-100', 'translate-y-0');
        wishlistNotification.classList.add('opacity-0', 'translate-y-2');
      }, 2000);
    }
  };

  return React.createElement(
    'div',
    { className: 'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 relative' },
    
    // Wishlist button
    React.createElement(
      'button',
      {
        onClick: toggleWishlist,
        className: `absolute top-2 left-2 p-2 rounded-full transition-colors z-10 ${
          isInWishlist(id) 
            ? 'bg-red-500 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`
      },
      React.createElement(HeartIcon, { 
        className: `h-5 w-5 ${isInWishlist(id) ? 'fill-current' : ''}` 
      })
    ),
    
    // Image container
    React.createElement(
      'div',
      { className: 'h-48 overflow-hidden relative' },
      React.createElement('img', {
        src: image,
        alt: name,
        className: 'w-full h-full object-cover'
      })
    ),
    
    // Content
    React.createElement(
      'div',
      { className: 'p-4' },
      // Category name
      React.createElement(
        'span',
        { className: 'text-xs font-semibold text-blue-600 uppercase tracking-wider' },
        category
      ),
      
      // Product name
      React.createElement('h3', { className: 'text-lg font-semibold mt-1' }, name),
      
      // Remaining Stocks
      React.createElement(
        'div',
        { className: 'mt-1 mb-2' },
        React.createElement(
          'span',
          { 
            className: `text-sm font-medium ${
              (remainingStocks || 0) > 10 
                ? 'text-green-600' 
                : (remainingStocks || 0) > 0 
                ? 'text-orange-600' 
                : 'text-red-600'
            }` 
          },
          (remainingStocks || 0) > 0 
            ? `Remaining ${remainingStocks || 0} Stocks` 
            : 'Out of Stock'
        )
      ),
      
      // Product specifications
      React.createElement(
        'div',
        { className: 'space-y-1 text-sm text-gray-600 mb-3' },
        weight && React.createElement(
          'div',
          { className: 'flex justify-between' },
          React.createElement('span', { className: 'font-medium' }, 'WEIGHT'),
          React.createElement('span', null, weight)
        ),
        middlePosition && React.createElement(
          'div',
          { className: 'flex justify-between' },
          React.createElement('span', { className: 'font-medium' }, 'MIDDLE POSITION'),
          React.createElement('span', null, middlePosition)
        ),
        concave && React.createElement(
          'div',
          { className: 'flex justify-between' },
          React.createElement('span', { className: 'font-medium' }, 'CONCAVE'),
          React.createElement('span', null, concave)
        )
      ),
      
      // Description
      React.createElement(
        'p',
        { className: 'text-gray-600 text-sm mt-2 line-clamp-2' },
        description
      ),
      
      // Price - Centered
      React.createElement(
        'div',
        { className: 'mt-4 flex justify-center' },
        React.createElement(
          'span',
          { className: 'text-xl font-bold text-gray-900 text-center' },
          `Rs ${price ? price.toFixed(2) : '0.00'}`
        )
      ),
      

      
      // Add to Cart button
      React.createElement(
        'button',
        {
          onClick: handleAddToCart,
          disabled: (remainingStocks || 0) === 0,
          className: `mt-4 w-full py-2 rounded-md transition-colors flex items-center justify-center ${
            (remainingStocks || 0) === 0
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`
        },
        React.createElement(FileText, { className: 'h-4 w-4 mr-2' }),
        (remainingStocks || 0) === 0 ? 'Out of Stock' : 'View Details'
      )
    ),
    
    // Success notification for cart
    React.createElement(
      'div',
      {
        id: `notification-${id}`,
        className: 'absolute top-2 right-2 bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full opacity-0 translate-y-2 transition-all duration-300'
      },
      'Added to cart!'
    ),
    
    // Success notification for wishlist
    React.createElement(
      'div',
      {
        id: `wishlist-notification-${id}`,
        className: 'absolute top-12 right-2 bg-pink-100 text-pink-800 text-sm py-1 px-3 rounded-full opacity-0 translate-y-2 transition-all duration-300'
      },
      'Added to wishlist!'
    )
  );
};

ProductCard.propTypes = undefined;

export default ProductCard;