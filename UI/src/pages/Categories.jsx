import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import { FilterIcon, SearchIcon } from 'lucide-react';

const Categories = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safe current category with null checks
  const currentCategory = categories?.find(cat => cat?.slug === category) || null;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products and categories simultaneously
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          productService.getAllCategories()
        ]);

        setAllProducts(productsData || []);
        setCategories(categoriesData || []);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update selected categories when URL parameter changes
  useEffect(() => {
    if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories([]);
    }
  }, [category]);

  useEffect(() => {
    let filtered = allProducts || [];

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product && selectedCategories.includes(product.category)
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product =>
          product?.name?.toLowerCase().includes(term) ||
          product?.description?.toLowerCase().includes(term)
      );
    }

    filtered = filtered.filter(
      product => product?.price >= priceRange[0] && product?.price <= priceRange[1]
    );

    switch (sortOption) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => (a?.price || 0) - (b?.price || 0));
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => (b?.price || 0) - (a?.price || 0));
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
        break;
      default:
        // 'featured' - no sorting
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, selectedCategories, searchTerm, priceRange, sortOption]);

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

  // Safe function to get category description
  const getCategoryDescription = () => {
    if (!currentCategory || !currentCategory.title) {
      return 'Browse our complete collection of sports equipment.';
    }
    return `Explore our range of ${currentCategory.title.toLowerCase()} equipment for all skill levels.`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header - Completely safe now */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {currentCategory?.title || 'All Products'}
        </h1>
        <p className="text-gray-600">
          {getCategoryDescription()}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="w-full md:w-1/3 relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-md bg-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="h-4 w-4" />
            Filters
          </button>
          <select
            className="px-4 py-2 border rounded-md bg-white"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Main Content: Filters + Products */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`w-full md:w-1/4 lg:w-1/5 md:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span>Rs {priceRange[0]}</span>
                <span>Rs {priceRange[1]}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="300000"
                  value={priceRange[0]}
                  onChange={e => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= priceRange[1]) {
                      setPriceRange([newMin, priceRange[1]]);
                    }
                  }}
                  className="absolute w-full z-10 appearance-none h-2 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="300000"
                  value={priceRange[1]}
                  onChange={e => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= priceRange[0]) {
                      setPriceRange([priceRange[0], newMax]);
                    }
                  }}
                  className="absolute w-full z-20 appearance-none h-2 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div
                  className="absolute w-full h-2 bg-gray-200 rounded-full z-0"
                  style={{
                    background: `linear-gradient(to right, 
                      #d1d5db 0%, 
                      #d1d5db ${(priceRange[0] / 300000) * 100}%, 
                      #3b82f6 ${(priceRange[0] / 300000) * 100}%, 
                      #3b82f6 ${(priceRange[1] / 300000) * 100}%, 
                      #d1d5db ${(priceRange[1] / 300000) * 100}%, 
                      #d1d5db 100%)`
                  }}
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium mb-2">Categories</h4>
              <ul className="space-y-2">
                {(categories || []).map(cat => (
                  <li key={cat?.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={cat?.slug}
                      checked={selectedCategories.includes(cat?.slug)}
                      onChange={() => handleCategoryChange(cat?.slug)}
                      className="mr-2 cursor-pointer"
                    />
                    <label 
                      htmlFor={cat?.slug}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      {cat?.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product?.id}
                  id={product?.id}
                  name={product?.name}
                  description={product?.description}
                  price={product?.price}
                  image={product?.imageUrl}
                  category={product?.category}
                  remainingStocks={product?.stock}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;