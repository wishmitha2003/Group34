import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import { FilterIcon, SearchIcon } from 'lucide-react';

const Categories = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const currentCategory = categories.find(cat => cat.slug === category);

  // Update selected categories when URL parameter changes
  useEffect(() => {
    if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories([]);
    }
  }, [category]);

  useEffect(() => {
    let filtered = products;

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }

    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortOption) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // 'featured' - no sorting
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategories, searchTerm, priceRange, sortOption]);

  const handleCategoryChange = (categorySlug) => {
    if (selectedCategories.includes(categorySlug)) {
      // If category is already selected, deselect it and navigate to all products
      setSelectedCategories([]);
      navigate('/categories');
    } else {
      // Select the category and update URL
      setSelectedCategories([categorySlug]);
      navigate(`/categories/${categorySlug}`);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 300000]);
    setSearchTerm('');
    setSortOption('featured');
    navigate('/categories');
  };

  return React.createElement(
    'div',
    { className: 'container mx-auto px-4 py-8' },
    // Category Header
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement(
        'h1',
        { className: 'text-3xl font-bold mb-2' },
        currentCategory ? currentCategory.title : 'All Products'
      ),
      React.createElement(
        'p',
        { className: 'text-gray-600' },
        currentCategory
          ? `Explore our range of ${currentCategory.title.toLowerCase()} equipment for all skill levels.`
          : 'Browse our complete collection of sports equipment.'
      )
    ),
    // Search and Filter Bar
    React.createElement(
      'div',
      { className: 'flex flex-col md:flex-row items-center justify-between mb-6 gap-4' },
      React.createElement(
        'div',
        { className: 'w-full md:w-1/3 relative' },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search products...',
          className: 'w-full pl-10 pr-4 py-2 border rounded-md',
          value: searchTerm,
          onChange: e => setSearchTerm(e.target.value)
        }),
        React.createElement(SearchIcon, { className: 'absolute left-3 top-2.5 h-5 w-5 text-gray-400' })
      ),
      React.createElement(
        'div',
        { className: 'flex gap-4 w-full md:w-auto' },
        React.createElement(
          'button',
          {
            className: 'md:hidden flex items-center gap-2 px-4 py-2 border rounded-md bg-white',
            onClick: () => setShowFilters(!showFilters)
          },
          React.createElement(FilterIcon, { className: 'h-4 w-4' }),
          'Filters'
        ),
        React.createElement(
          'select',
          {
            className: 'px-4 py-2 border rounded-md bg-white',
            value: sortOption,
            onChange: e => setSortOption(e.target.value)
          },
          React.createElement('option', { value: 'featured' }, 'Featured'),
          React.createElement('option', { value: 'price-low' }, 'Price: Low to High'),
          React.createElement('option', { value: 'price-high' }, 'Price: High to Low'),
          React.createElement('option', { value: 'name' }, 'Name: A to Z')
        )
      )
    ),
    // Main Content: Filters + Products
    React.createElement(
      'div',
      { className: 'flex flex-col md:flex-row gap-8' },
      // Filters Sidebar
      React.createElement(
        'div',
        {
          className: `w-full md:w-1/4 lg:w-1/5 md:block ${showFilters ? 'block' : 'hidden'}`
        },
        React.createElement(
          'div',
          { className: 'bg-white p-4 rounded-lg shadow-md' },
          React.createElement(
            'div',
            { className: 'flex justify-between items-center mb-4' },
            React.createElement('h3', { className: 'text-lg font-semibold' }, 'Filters'),
            React.createElement(
              'button',
              {
                onClick: handleClearFilters,
                className: 'text-sm text-blue-600 hover:text-blue-800'
              },
              'Clear all'
            )
          ),
          // ✅ Fixed Price Range - Now in one line
          React.createElement(
            'div',
            { className: 'mb-6' },
            React.createElement('h4', { className: 'font-medium mb-2' }, 'Price Range'),
            React.createElement(
              'div',
              { className: 'flex items-center justify-between mb-2 text-sm' },
              React.createElement('span', null, `Rs ${priceRange[0]}`),
              React.createElement('span', null, `Rs ${priceRange[1]}`)
            ),
            // Both range sliders in one line container
            React.createElement(
              'div',
              { className: 'relative' },
              // Min Range (left slider)
              React.createElement('input', {
                type: 'range',
                min: '0',
                max: '300000',
                value: priceRange[0],
                onChange: e => {
                  const newMin = parseInt(e.target.value);
                  if (newMin <= priceRange[1]) {
                    setPriceRange([newMin, priceRange[1]]);
                  }
                },
                className: 'absolute w-full z-10 appearance-none h-2 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer'
              }),
              // Max Range (right slider)
              React.createElement('input', {
                type: 'range',
                min: '0',
                max: '300000',
                value: priceRange[1],
                onChange: e => {
                  const newMax = parseInt(e.target.value);
                  if (newMax >= priceRange[0]) {
                    setPriceRange([priceRange[0], newMax]);
                  }
                },
                className: 'absolute w-full z-20 appearance-none h-2 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer'
              }),
              // Track background
              React.createElement(
                'div',
                { 
                  className: 'absolute w-full h-2 bg-gray-200 rounded-full z-0',
                  style: {
                    background: `linear-gradient(to right, 
                      #d1d5db 0%, 
                      #d1d5db ${(priceRange[0] / 300000) * 100}%, 
                      #3b82f6 ${(priceRange[0] / 300000) * 100}%, 
                      #3b82f6 ${(priceRange[1] / 300000) * 100}%, 
                      #d1d5db ${(priceRange[1] / 300000) * 100}%, 
                      #d1d5db 100%)`
                  }
                }
              )
            )
          ),
          // ✅ Fixed Categories - Now clickable and updates URL
          React.createElement(
            'div',
            null,
            React.createElement('h4', { className: 'font-medium mb-2' }, 'Categories'),
            React.createElement(
              'ul',
              { className: 'space-y-2' },
              ...categories.map(cat =>
                React.createElement(
                  'li',
                  { key: cat.id, className: 'flex items-center' },
                  React.createElement('input', {
                    type: 'checkbox',
                    id: cat.slug,
                    checked: selectedCategories.includes(cat.slug),
                    onChange: () => handleCategoryChange(cat.slug),
                    className: 'mr-2 cursor-pointer'
                  }),
                  React.createElement(
                    'label', 
                    { 
                      htmlFor: cat.slug,
                      className: 'cursor-pointer hover:text-blue-600'
                    }, 
                    cat.title
                  )
                )
              )
            )
          )
        )
      ),
      // Products Grid
      React.createElement(
        'div',
        { className: 'flex-1' },
        filteredProducts.length > 0
          ? React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' },
              ...filteredProducts.map(product =>
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
          : React.createElement(
              'div',
              { className: 'text-center py-12' },
              React.createElement('h3', { className: 'text-xl font-medium mb-2' }, 'No products found'),
              React.createElement(
                'p',
                { className: 'text-gray-600' },
                'Try adjusting your search or filter criteria'
              )
            )
      )
    )
  );
};

export default Categories;