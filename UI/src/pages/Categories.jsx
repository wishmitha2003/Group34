import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import { 
  SearchIcon, 
  XIcon,
  Grid3X3Icon,
  ListIcon,
  ChevronDownIcon,
  SlidersHorizontalIcon,
  SparklesIcon
} from 'lucide-react';

const Categories = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentCategory = categories?.find(cat => cat?.slug === category) || null;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

  // Filter and sort products
  useEffect(() => {
    let filtered = allProducts || [];

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product && selectedCategories.includes(product.category)
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product =>
          product?.name?.toLowerCase().includes(term) ||
          product?.description?.toLowerCase().includes(term)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      product => product?.price >= priceRange[0] && product?.price <= priceRange[1]
    );

    // Sort products
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
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, selectedCategories, searchTerm, priceRange, sortOption]);

  const handleCategoryChange = (categorySlug) => {
    if (selectedCategories.includes(categorySlug)) {
      setSelectedCategories([]);
      navigate('/categories');
    } else {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCategoryDescription = () => {
    if (!currentCategory || !currentCategory.title) {
      return 'Discover premium sports equipment designed for athletes of all levels. Professional gear for exceptional performance.';
    }
    return `Premium ${currentCategory.title.toLowerCase()} collection - professional gear designed for serious athletes and peak performance.`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mb-6"></div>
              <SparklesIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">Curating Your Collection</div>
            <div className="text-gray-600 text-lg">Finding the best products for you...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-8 shadow-lg">
              <XIcon className="h-16 w-16 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Products</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Enhanced Header Section */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/60">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <SparklesIcon className="h-4 w-4" />
              Premium Sports Collection
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              {currentCategory?.title || 'All Products'}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {getCategoryDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Controls Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/60 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full max-w-2xl">
              <div className="relative">
                <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, description, or features..."
                  className="w-full pl-14 pr-6 py-4 bg-white border border-gray-300/80 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm text-lg"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Controls Group */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  className="w-full appearance-none bg-white border border-gray-300/80 rounded-2xl pl-5 pr-12 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm text-lg font-medium cursor-pointer"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Button */}
              <button
                className="lg:hidden flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                onClick={() => setMobileFilterOpen(true)}
              >
                <SlidersHorizontalIcon className="h-5 w-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Active Filters & Results */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t border-gray-200/60">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <span className="text-lg font-semibold text-gray-900">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </span>
              {(selectedCategories.length > 0 || searchTerm || priceRange[0] > 0 || priceRange[1] < 300000) && (
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors duration-200 flex items-center gap-2"
                >
                  Clear Filters
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Quick Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories?.slice(0, 4).map(cat => (
                <button
                  key={cat?.id}
                  onClick={() => handleCategoryChange(cat?.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategories.includes(cat?.slug)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300/80 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  {cat?.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8' 
                : 'space-y-6'
              }
            `}>
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
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/60">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <SearchIcon className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Products Found</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
                We couldn't find any products matching your criteria. Try adjusting your search terms or filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Show All Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Mobile Filter Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-3 hover:bg-gray-100 rounded-2xl transition-colors duration-200"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Price Range */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Price Range</h4>
                  <div className="space-y-6">
                    <div className="relative pt-8">
                      <div className="relative h-3 bg-gray-200 rounded-full">
                        <div
                          className="absolute h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          style={{
                            left: `${(priceRange[0] / 300000) * 100}%`,
                            right: `${100 - (priceRange[1] / 300000) * 100}%`
                          }}
                        />
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
                          className="absolute w-full top-0 h-3 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-2xl [&::-webkit-slider-thumb]:cursor-pointer"
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
                          className="absolute w-full top-0 h-3 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-purple-600 [&::-webkit-slider-thumb]:shadow-2xl [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between text-lg font-semibold text-gray-900 mt-6">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Categories</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categories?.map(cat => (
                      <button
                        key={cat?.id}
                        onClick={() => handleCategoryChange(cat?.slug)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                          selectedCategories.includes(cat?.slug)
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:shadow-md'
                        }`}
                      >
                        <div className="font-semibold">{cat?.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 p-6 bg-white">
                <div className="flex gap-4">
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:border-gray-400 transition-all duration-300"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;