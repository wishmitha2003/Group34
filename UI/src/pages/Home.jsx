import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { categories, products } from '../data/products';

const Home = () => {
  // Get featured products (one from each category)
  const featuredProducts = categories
    .map(category => products.find(product => product.category === category.slug))
    .filter(Boolean);

  return React.createElement(
    'div',
    { className: 'w-full' },
    // Hero Section
    React.createElement(
      'section',
      { className: 'relative bg-blue-600 text-white' },
      React.createElement(
        'div',
        { className: 'absolute inset-0 overflow-hidden' },
        React.createElement('img', {
          src: 'https://thewaveandaman.com/wp-content/uploads/2025/06/All-Sports.jpg',
          alt: 'Sports Equipment',
          className: 'w-full h-full object-cover opacity-20'
        })
      ),
      React.createElement(
        'div',
        { className: 'container mx-auto px-4 py-20 relative z-10' },
        React.createElement(
          'div',
          { className: 'max-w-2xl' },
          React.createElement('h1', { className: 'text-4xl md:text-5xl font-bold mb-4' }, 'Gear Up for Greatness'),
          React.createElement(
            'p',
            { className: 'text-xl mb-8' },
            'Premium sports equipment for athletes of all levels. Find everything you need for cricket, football, indoor games, and gym workouts.'
          ),
          React.createElement(
            'div',
            { className: 'flex flex-wrap gap-4' },
            React.createElement(
              Link,
              {
                to: '/categories/cricket',
                className: 'bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors'
              },
              'Shop Now'
            ),
            React.createElement(
              Link,
              {
                to: '/categories',
                className: 'bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors'
              },
              'Explore Categories'
            )
          )
        )
      )
    ),
    // Categories Section
    React.createElement(
      'section',
      { className: 'py-16 bg-gray-50' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-8' },
          React.createElement('h2', { className: 'text-3xl font-bold' }, 'Shop by Category'),
          React.createElement(
            Link,
            { className: 'text-blue-600 font-semibold hover:underline' },
            'View All'
          )
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' },
          ...categories.map(category =>
            React.createElement(CategoryCard, {
              key: category.id,
              title: category.title,
              image: category.image,
              slug: category.slug,
              productCount: category.productCount
            })
          )
        )
      )
    ),
    // Featured Products
    React.createElement(
      'section',
      { className: 'py-16' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-8' },
          React.createElement('h2', { className: 'text-3xl font-bold' }, 'Featured Products'),
          React.createElement(
            Link,
            { className: 'text-blue-600 font-semibold hover:underline' },
            'View All Products'
          )
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' },
          ...featuredProducts.map(product =>
            product &&
            React.createElement(ProductCard, {
              key: product.id,
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              category: product.category
            })
          )
        )
      )
    ),
    // Benefits Section
    React.createElement(
      'section',
      { className: 'py-16 bg-gray-50' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4' },
        React.createElement('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Why Choose GenZsport'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
          // Benefit 1: Quality Products
          React.createElement(
            'div',
            { className: 'bg-white p-6 rounded-lg shadow-md text-center' },
            React.createElement(
              'div',
              { className: 'bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4' },
              React.createElement(ShoppingBagIcon, { className: 'h-8 w-8 text-blue-600' })
            ),
            React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, 'Quality Products'),
            React.createElement(
              'p',
              { className: 'text-gray-600' },
              'We source the highest quality sports equipment from trusted manufacturers around the world.'
            )
          ),
          // Benefit 2: Competitive Pricing
          React.createElement(
            'div',
            { className: 'bg-white p-6 rounded-lg shadow-md text-center' },
            React.createElement(
              'div',
              { className: 'bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4' },
              React.createElement(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  className: 'h-8 w-8 text-blue-600',
                  fill: 'none',
                  viewBox: '0 0 24 24',
                  stroke: 'currentColor'
                },
                React.createElement('path', {
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 2,
                  d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                })
              )
            ),
            React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, 'Competitive Pricing'),
            React.createElement(
              'p',
              { className: 'text-gray-600' },
              'Get the best value for your money with our competitive prices and regular promotions.'
            )
          ),
          // Benefit 3: Fast Delivery
          React.createElement(
            'div',
            { className: 'bg-white p-6 rounded-lg shadow-md text-center' },
            React.createElement(
              'div',
              { className: 'bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4' },
              React.createElement(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  className: 'h-8 w-8 text-blue-600',
                  fill: 'none',
                  viewBox: '0 0 24 24',
                  stroke: 'currentColor'
                },
                React.createElement('path', {
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 2,
                  d: 'M5 13l4 4L19 7'
                })
              )
            ),
            React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, 'Fast Delivery'),
            React.createElement(
              'p',
              { className: 'text-gray-600' },
              'Quick shipping and hassle-free delivery to your doorstep, so you can get playing sooner.'
            )
          )
        )
      )
    ),
    // Newsletter Section
    React.createElement(
      'section',
      { className: 'py-16 bg-blue-600 text-white' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4 text-center' },
        React.createElement('h2', { className: 'text-3xl font-bold mb-4' }, 'Stay Updated'),
        React.createElement(
          'p',
          { className: 'text-xl mb-8 max-w-2xl mx-auto' },
          'Subscribe to our newsletter for the latest product updates, exclusive offers, and sports tips.'
        ),
        React.createElement(
          'form',
          { className: 'max-w-md mx-auto flex' },
          React.createElement('input', {
            type: 'email',
            placeholder: 'Your email address',
            className: 'px-4 py-3 rounded-l-md focus:outline-none text-gray-900 w-full'
          }),
          React.createElement(
            'button',
            {
              type: 'submit',
              className: 'bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-r-md font-semibold transition-colors'
            },
            'Subscribe'
          )
        )
      )
    )
  );
};

export default Home;