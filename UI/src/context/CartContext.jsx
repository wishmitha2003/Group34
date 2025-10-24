import React, { useEffect, useState, createContext, useContext } from 'react';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate that parsedCart is an array
        if (Array.isArray(parsedCart)) {
          // Ensure each item has required properties with fallbacks
          const validatedCart = parsedCart.map(item => ({
            id: item?.id || '',
            name: item?.name || 'Unknown Product',
            price: Number(item?.price) || 0,
            quantity: Math.max(1, Number(item?.quantity) || 1),
            image: item?.image || '',
            // Add any other required properties with fallbacks
          })).filter(item => item.id); // Remove items without id
          setCart(validatedCart);
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      localStorage.removeItem('cart');
      setCart([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage and recalculate totals whenever cart changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }

    // Safe calculation of totals
    const items = cart.reduce((sum, item) => {
      const quantity = Number(item?.quantity) || 0;
      return sum + quantity;
    }, 0);

    const price = cart.reduce((sum, item) => {
      const itemPrice = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 0;
      return sum + (itemPrice * quantity);
    }, 0);

    setTotalItems(items);
    setTotalPrice(price);
  }, [cart, isInitialized]);

  const addToCart = (item) => {
    if (!item?.id) {
      console.error('Cannot add item without id to cart');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { 
                ...cartItem, 
                quantity: cartItem.quantity + (Number(item.quantity) || 1)
              }
            : cartItem
        );
      } else {
        const newItem = {
          id: item.id,
          name: item.name || 'Unknown Product',
          price: Number(item.price) || 0,
          quantity: Math.max(1, Number(item.quantity) || 1),
          image: item.image || '',
          ...item
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (id) => {
    if (!id) {
      console.error('Cannot remove item without id from cart');
      return;
    }
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (!id) {
      console.error('Cannot update quantity for item without id');
      return;
    }

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity)) {
      console.error('Invalid quantity provided');
      return;
    }

    if (numQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: numQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Failed to clear cart from localStorage', error);
    }
  };

  // Provide loading state until cart is initialized
  if (!isInitialized) {
    return React.createElement(
      'div',
      { className: 'loading' },
      'Loading cart...'
    );
  }

  return React.createElement(
    CartContext.Provider,
    {
      value: {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInitialized
      }
    },
    children
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};