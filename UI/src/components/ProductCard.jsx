import React, { useState } from 'react';
import { PlusIcon, MinusIcon, ShoppingCartIcon, HeartIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // Import the wishlist context

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  category
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // Use wishlist context

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

    // Show wishlist notification
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
    
    // Wishlist button - positioned at top left
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
      // Category badge
      React.createElement(
        'span',
        { className: 'text-xs font-semibold text-blue-600 uppercase tracking-wider' },
        category
      ),
      // Product name
      React.createElement('h3', { className: 'text-lg font-semibold mt-1' }, name),
      // Description
      React.createElement(
        'p',
        { className: 'text-gray-600 text-sm mt-2 line-clamp-2' },
        description
      ),
      // Price and quantity controls
      React.createElement(
        'div',
        { className: 'mt-4 flex items-center justify-between' },
        React.createElement(
          'span',
          { className: 'text-xl font-bold text-gray-900' },
          `Rs ${price.toFixed(2)}`
        ),
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement(
            'button',
            {
              onClick: decreaseQuantity,
              className: 'p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors',
              disabled: quantity <= 1
            },
            React.createElement(MinusIcon, { className: 'h-4 w-4' })
          ),
          React.createElement('span', { className: 'w-6 text-center' }, quantity),
          React.createElement(
            'button',
            {
              onClick: increaseQuantity,
              className: 'p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
            },
            React.createElement(PlusIcon, { className: 'h-4 w-4' })
          )
        )
      ),
      // Add to Cart button
      React.createElement(
        'button',
        {
          onClick: handleAddToCart,
          className: 'mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center'
        },
        React.createElement(ShoppingCartIcon, { className: 'h-4 w-4 mr-2' }),
        'Add to Cart'
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