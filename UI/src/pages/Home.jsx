import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, StarIcon, ShieldCheckIcon, TruckIcon } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider images with sports themes
  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Premium Cricket Gear',
      subtitle: 'Professional equipment for serious players',
      buttonText: 'Shop Cricket',
      link: '/categories/cricket'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      title: 'Football Excellence',
      subtitle: 'Dominate the field with top-tier football gear',
      buttonText: 'Shop Football',
      link: '/categories/football'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Fitness & Gym Equipment',
      subtitle: 'Build your perfect home gym setup',
      buttonText: 'Shop Gym',
      link: '/categories/gym'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Indoor Sports',
      subtitle: 'Everything for indoor games and activities',
      buttonText: 'Shop Indoor',
      link: '/categories/indoor'
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto slide
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          productService.getAllCategories(),
          productService.getAllProducts()
        ]);
        
        setCategories(categoriesData);
        setProducts(productsData);
        
        // Get featured products (first few products or one from each category)
        const featured = productsData.slice(0, 8);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return React.createElement(
      'div',
      { className: 'w-full flex justify-center items-center min-h-screen bg-gray-50' },
      React.createElement(
        'div',
        { className: 'flex flex-col items-center' },
        React.createElement(
          'div',
          { className: 'animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4' }
        ),
        React.createElement('div', { className: 'text-xl text-gray-600 font-semibold' }, 'Loading Sports Gear...')
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'w-full overflow-hidden' },
    
    // Enhanced Hero Section with Slider
    React.createElement(
      'section',
      { className: 'relative h-screen max-h-[800px] overflow-hidden' },
      // Slides
      ...heroSlides.map((slide, index) =>
        React.createElement(
          'div',
          {
            key: slide.id,
            className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`
          },
          React.createElement('img', {
            src: slide.image,
            alt: slide.title,
            className: 'w-full h-full object-cover'
          }),
          React.createElement(
            'div',
            { className: 'absolute inset-0 bg-black/40' }
          )
        )
      ),
      
      // Slide Content
      React.createElement(
        'div',
        { className: 'relative z-20 h-full flex items-center' },
        React.createElement(
          'div',
          { className: 'container mx-auto px-4' },
          React.createElement(
            'div',
            { className: 'max-w-2xl text-white' },
            React.createElement(
              'h1',
              { 
                className: 'text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in' 
              },
              heroSlides[currentSlide].title
            ),
            React.createElement(
              'p',
              { 
                className: 'text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed' 
              },
              heroSlides[currentSlide].subtitle
            ),
            React.createElement(
              'div',
              { className: 'flex flex-wrap gap-4' },
              React.createElement(
                Link,
                {
                  to: heroSlides[currentSlide].link,
                  className: 'bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg'
                },
                heroSlides[currentSlide].buttonText
              ),
              React.createElement(
                Link,
                {
                  to: '/categories',
                  className: 'bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300'
                },
                'Explore All Categories'
              )
            )
          )
        )
      ),
      
      // Slide Navigation
      React.createElement(
        'button',
        {
          onClick: prevSlide,
          className: 'absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm'
        },
        React.createElement(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            className: 'h-6 w-6',
            fill: 'none',
            viewBox: '0 0 24 24',
            stroke: 'currentColor'
          },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M15 19l-7-7 7-7'
          })
        )
      ),
      React.createElement(
        'button',
        {
          onClick: nextSlide,
          className: 'absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm'
        },
        React.createElement(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            className: 'h-6 w-6',
            fill: 'none',
            viewBox: '0 0 24 24',
            stroke: 'currentColor'
          },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M9 5l7 7-7 7'
          })
        )
      ),
      
      // Slide Indicators
      React.createElement(
        'div',
        { className: 'absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3' },
        ...heroSlides.map((_, index) =>
          React.createElement(
            'button',
            {
              key: index,
              onClick: () => goToSlide(index),
              className: `w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-orange-500 scale-125' : 'bg-white/50'
              }`
            }
          )
        )
      )
    ),

    // Stats Section
    React.createElement(
      'section',
      { className: 'py-12 bg-gray-900 text-white' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4' },
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 md:grid-cols-4 gap-8 text-center' },
          React.createElement(
            'div',
            { className: 'space-y-2' },
            React.createElement('div', { className: 'text-3xl md:text-4xl font-bold text-orange-500' }, '10K+'),
            React.createElement('div', { className: 'text-gray-300' }, 'Happy Customers')
          ),
          React.createElement(
            'div',
            { className: 'space-y-2' },
            React.createElement('div', { className: 'text-3xl md:text-4xl font-bold text-orange-500' }, '500+'),
            React.createElement('div', { className: 'text-gray-300' }, 'Products')
          ),
          React.createElement(
            'div',
            { className: 'space-y-2' },
            React.createElement('div', { className: 'text-3xl md:text-4xl font-bold text-orange-500' }, '50+'),
            React.createElement('div', { className: 'text-gray-300' }, 'Brands')
          ),
          React.createElement(
            'div',
            { className: 'space-y-2' },
            React.createElement('div', { className: 'text-3xl md:text-4xl font-bold text-orange-500' }, '24/7'),
            React.createElement('div', { className: 'text-gray-300' }, 'Support')
          )
        )
      )
    ),

    // Enhanced Categories Section
    React.createElement(
      'section',
      { className: 'py-20 bg-gradient-to-br from-gray-50 to-blue-50' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4' },
        React.createElement(
          'div',
          { className: 'text-center mb-16' },
          React.createElement(
            'h2',
            { className: 'text-4xl md:text-5xl font-bold text-gray-900 mb-4' },
            'Shop by Category'
          ),
          React.createElement(
            'p',
            { className: 'text-xl text-gray-600 max-w-2xl mx-auto' },
            'Discover the perfect gear for your favorite sport. From professional equipment to casual play.'
          )
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8' },
          ...categories.map(category =>
            React.createElement(CategoryCard, {
              key: category.id,
              title: category.title,
              image: category.image,
              slug: category.slug,
              productCount: category.productCount
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'text-center mt-12' },
          React.createElement(
            Link,
            {
              to: '/categories',
              className: 'inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg'
            },
            'View All Categories',
            React.createElement(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                className: 'h-5 w-5 ml-2',
                viewBox: '0 0 20 20',
                fill: 'currentColor'
              },
              React.createElement('path', {
                fillRule: 'evenodd',
                d: 'M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z',
                clipRule: 'evenodd'
              })
            )
          )
        )
      )
    ),

    // Enhanced Featured Products
    React.createElement(
      'section',
      { className: 'py-20 bg-white' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4' },
        React.createElement(
          'div',
          { className: 'text-center mb-16' },
          React.createElement(
            'h2',
            { className: 'text-4xl md:text-5xl font-bold text-gray-900 mb-4' },
            'Featured Products'
          ),
          React.createElement(
            'p',
            { className: 'text-xl text-gray-600 max-w-2xl mx-auto' },
            'Handpicked selection of our best-selling and highest quality sports equipment'
          )
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8' },
          ...featuredProducts.map(product =>
            product &&
            React.createElement(ProductCard, {
              key: product.id,
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.imageUrl,
              category: product.category,
              remainingStocks: product.stock
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'text-center mt-12' },
          React.createElement(
            Link,
            {
              to: '/products',
              className: 'inline-flex items-center px-8 py-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg'
            },
            'View All Products',
            React.createElement(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                className: 'h-5 w-5 ml-2',
                viewBox: '0 0 20 20',
                fill: 'currentColor'
              },
              React.createElement('path', {
                fillRule: 'evenodd',
                d: 'M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z',
                clipRule: 'evenodd'
              })
            )
          )
        )
      )
    ),

    // Enhanced Benefits Section
    React.createElement(
      'section',
      { className: 'py-20 bg-gradient-to-br from-blue-50 to-gray-50' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4' },
        React.createElement(
          'div',
          { className: 'text-center mb-16' },
          React.createElement(
            'h2',
            { className: 'text-4xl md:text-5xl font-bold text-gray-900 mb-4' },
            'Why Choose GenZsport'
          ),
          React.createElement(
            'p',
            { className: 'text-xl text-gray-600 max-w-2xl mx-auto' },
            'We are committed to providing the best sports equipment and shopping experience'
          )
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
          // Benefit 1: Quality Products
          React.createElement(
            'div',
            { className: 'bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center' },
            React.createElement(
              'div',
              { className: 'bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6' },
              React.createElement(ShieldCheckIcon, { className: 'h-10 w-10 text-blue-600' })
            ),
            React.createElement('h3', { className: 'text-2xl font-bold mb-4 text-gray-900' }, 'Premium Quality'),
            React.createElement(
              'p',
              { className: 'text-gray-600 leading-relaxed' },
              'All our products are sourced from certified manufacturers and undergo rigorous quality checks to ensure top performance.'
            )
          ),
          // Benefit 2: Fast Delivery
          React.createElement(
            'div',
            { className: 'bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center' },
            React.createElement(
              'div',
              { className: 'bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6' },
              React.createElement(TruckIcon, { className: 'h-10 w-10 text-green-600' })
            ),
            React.createElement('h3', { className: 'text-2xl font-bold mb-4 text-gray-900' }, 'Fast Delivery'),
            React.createElement(
              'p',
              { className: 'text-gray-600 leading-relaxed' },
              'Free express shipping on orders over $99. Get your gear delivered within 2-3 business days anywhere in the country.'
            )
          ),
          // Benefit 3: Expert Support
          React.createElement(
            'div',
            { className: 'bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center' },
            React.createElement(
              'div',
              { className: 'bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6' },
              React.createElement(StarIcon, { className: 'h-10 w-10 text-orange-600' })
            ),
            React.createElement('h3', { className: 'text-2xl font-bold mb-4 text-gray-900' }, 'Expert Support'),
            React.createElement(
              'p',
              { className: 'text-gray-600 leading-relaxed' },
              'Our team of sports enthusiasts and experts are available 24/7 to help you choose the perfect equipment for your needs.'
            )
          )
        )
      )
    ),

    // Enhanced Newsletter Section
    React.createElement(
      'section',
      { className: 'py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white' },
      React.createElement(
        'div',
        { className: 'container mx-auto px-4 text-center' },
        React.createElement(
          'div',
          { className: 'max-w-4xl mx-auto' },
          React.createElement('h2', { className: 'text-4xl md:text-5xl font-bold mb-6' }, 'Join the GenZsport Community'),
          React.createElement(
            'p',
            { className: 'text-xl mb-8 text-blue-100 leading-relaxed' },
            'Be the first to know about new arrivals, exclusive deals, and professional sports tips. Join 50,000+ athletes who trust us for their gear.'
          ),
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto' },
            React.createElement('input', {
              type: 'email',
              placeholder: 'Your email address',
              className: 'px-6 py-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-500/50 text-gray-900 flex-1 text-lg'
            }),
            React.createElement(
              'button',
              {
                type: 'submit',
                className: 'bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap'
              },
              'Subscribe Now'
            )
          ),
          React.createElement(
            'p',
            { className: 'text-sm text-blue-200 mt-4' },
            'No spam, unsubscribe at any time. We respect your privacy.'
          )
        )
      )
    )
  );
};

export default Home;