import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, MenuIcon, XIcon, SearchIcon, UserIcon, HeartIcon, ChevronDownIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isIndoorGamesOpen, setIsIndoorGamesOpen] = useState(false);
  const [isOutdoorGamesOpen, setIsOutdoorGamesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef(null);
  const indoorGamesRef = useRef(null);
  const outdoorGamesRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (indoorGamesRef.current && !indoorGamesRef.current.contains(event.target)) {
        setIsIndoorGamesOpen(false);
      }
      if (outdoorGamesRef.current && !outdoorGamesRef.current.contains(event.target)) {
        setIsOutdoorGamesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleUserMenuClick = (path) => {
    navigate(path);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  // Get user's profile picture or generate initials
  const getProfileContent = () => {
    if (user?.profilePicture) {
      return (
        <img 
          src={user.profilePicture} 
          alt="Profile" 
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    } else {
      // Fallback to initials or user icon
      const initials = user?.username?.substring(0, 2)?.toUpperCase() || 
                      user?.name?.substring(0, 2)?.toUpperCase() || 
                      <UserIcon className="h-4 w-4" />;
      
      return (
        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
      );
    }
  };

  // User Profile Dropdown Component
  const UserProfileDropdown = () => (
    <div 
      ref={userMenuRef}
      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-100 flex items-center space-x-3">
        <div className="flex-shrink-0">
          {getProfileContent()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.username || user?.name || 'User'}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {user?.email || 'Welcome!'}
          </p>
        </div>
      </div>
      
      <div className="py-1">
        <button
          onClick={() => handleUserMenuClick('/profile')}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          My Profile
        </button>
        <button
          onClick={() => handleUserMenuClick('/order-history')}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Order History
        </button>
        <button
          onClick={() => handleUserMenuClick('/wishlist')}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Wishlist
          {wishlistCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {wishlistCount}
            </span>
          )}
        </button>
        <button
          onClick={() => handleUserMenuClick('/settings')}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Settings
        </button>
      </div>
      
      <div className="border-t border-gray-100 pt-1">
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );

  // Indoor Games Dropdown Component
  const IndoorGamesDropdown = () => (
    <div 
      ref={indoorGamesRef}
      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40"
    >
      <Link 
        to="/categories/table-tennis" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsIndoorGamesOpen(false)}
      >
        Table Tennis
      </Link>
      <Link 
        to="/categories/carrom" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsIndoorGamesOpen(false)}
      >
        Carrom
      </Link>
      <Link 
        to="/categories/chess" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsIndoorGamesOpen(false)}
      >
        Chess
      </Link>
      <Link 
        to="/categories/badminton" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsIndoorGamesOpen(false)}
      >
        Badminton
      </Link>
      <Link 
        to="/categories/billiards" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsIndoorGamesOpen(false)}
      >
        Billiards & Pool
      </Link>
      <Link 
        to="/categories/darts" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsIndoorGamesOpen(false)}
      >
        Darts
      </Link>
      <Link 
        to="/categories/board-games" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsIndoorGamesOpen(false)}
      >
        Board Games
      </Link>
    </div>
  );

  // Outdoor Games Dropdown Component
  const OutdoorGamesDropdown = () => (
    <div 
      ref={outdoorGamesRef}
      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40"
    >
      <Link 
        to="/categories/cricket" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOutdoorGamesOpen(false)}
      >
        Cricket
      </Link>
      <Link 
        to="/categories/football" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOutdoorGamesOpen(false)}
      >
        Football
      </Link>
      <Link 
        to="/categories/basketball" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOutdoorGamesOpen(false)}
      >
        Basketball
      </Link>
      <Link 
        to="/categories/tennis" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOutdoorGamesOpen(false)}
      >
        Tennis
      </Link>
      <Link 
        to="/categories/volleyball" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOutdoorGamesOpen(false)}
      >
        Volleyball
      </Link>
      <Link 
        to="/categories/baseball" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOutdoorGamesOpen(false)}
      >
        Baseball
      </Link>
      <Link 
        to="/categories/rugby" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOutdoorGamesOpen(false)}
      >
        Rugby
      </Link>
    </div>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-2xl font-bold text-blue-600">
              GenZ<span className="text-orange-500">sport</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link 
              to="/" 
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            
            {/* Indoor Games Dropdown */}
            <div className="relative">
              <button 
                className="font-medium hover:text-blue-600 transition-colors flex items-center space-x-1"
                onClick={() => setIsIndoorGamesOpen(!isIndoorGamesOpen)}
              >
                <span>Indoor Games</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              {isIndoorGamesOpen && <IndoorGamesDropdown />}
            </div>

            {/* Outdoor Games Dropdown */}
            <div className="relative">
              <button 
                className="font-medium hover:text-blue-600 transition-colors flex items-center space-x-1"
                onClick={() => setIsOutdoorGamesOpen(!isOutdoorGamesOpen)}
              >
                <span>Outdoor Games</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              {isOutdoorGamesOpen && <OutdoorGamesDropdown />}
            </div>

            <Link 
              to="/categories/gym" 
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Gym
            </Link>
            <Link 
              to="/categories/others" 
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Others
            </Link>
          </nav>

          {/* Search, Cart, and Login */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative border rounded-full px-3 py-1 flex items-center hover:border-blue-500 transition-colors">
                <SearchIcon className="h-4 w-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-40 text-sm focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative border rounded-full p-2 hover:border-red-500 hover:text-red-600 transition-colors"
            >
              <HeartIcon className="h-6 w-6 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative border rounded-full p-2 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Login/User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {getProfileContent()}
                  <span className="text-sm font-medium hidden lg:inline">
                    {user?.username || user?.name || 'Account'}
                  </span>
                </button>
                {isUserMenuOpen && <UserProfileDropdown />}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center border rounded-full px-4 py-2 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center mb-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Wishlist Icon - Mobile */}
              <Link 
                to="/wishlist" 
                className="relative p-2 ml-2 border rounded-full hover:border-red-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <HeartIcon className="h-6 w-6 text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon - Mobile */}
              <Link 
                to="/cart" 
                className="relative p-2 ml-2 border rounded-full hover:border-blue-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Indoor Games Mobile */}
              <div className="border-b border-gray-100">
                <button 
                  className="font-medium hover:text-blue-600 transition-colors py-2 flex items-center justify-between w-full"
                  onClick={() => setIsIndoorGamesOpen(!isIndoorGamesOpen)}
                >
                  <span>Indoor Games</span>
                  <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${isIndoorGamesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isIndoorGamesOpen && (
                  <div className="ml-4 mt-2 space-y-2 pb-2">
                    <Link to="/categories/table-tennis" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Table Tennis</Link>
                    <Link to="/categories/carrom" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Carrom</Link>
                    <Link to="/categories/chess" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Chess</Link>
                    <Link to="/categories/badminton" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Badminton</Link>
                    <Link to="/categories/billiards" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Billiards & Pool</Link>
                    <Link to="/categories/darts" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Darts</Link>
                    <Link to="/categories/board-games" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Board Games</Link>
                  </div>
                )}
              </div>

              {/* Outdoor Games Mobile */}
              <div className="border-b border-gray-100">
                <button 
                  className="font-medium hover:text-blue-600 transition-colors py-2 flex items-center justify-between w-full"
                  onClick={() => setIsOutdoorGamesOpen(!isOutdoorGamesOpen)}
                >
                  <span>Outdoor Games</span>
                  <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${isOutdoorGamesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOutdoorGamesOpen && (
                  <div className="ml-4 mt-2 space-y-2 pb-2">
                    <Link to="/categories/cricket" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Cricket</Link>
                    <Link to="/categories/football" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Football</Link>
                    <Link to="/categories/basketball" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Basketball</Link>
                    <Link to="/categories/tennis" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Tennis</Link>
                    <Link to="/categories/volleyball" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Volleyball</Link>
                    <Link to="/categories/baseball" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Baseball</Link>
                    <Link to="/categories/rugby" className="block text-sm py-1 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Rugby</Link>
                  </div>
                )}
              </div>

              <Link 
                to="/categories/gym" 
                className="font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Gym
              </Link>
              <Link 
                to="/categories/others" 
                className="font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Others
              </Link>
              
              {/* User Menu Items for Mobile - Only show if authenticated */}
              {isAuthenticated ? (
                <>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-3 py-2">
                      {getProfileContent()}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.username || user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || 'Welcome!'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      My Account
                    </p>
                    <Link 
                      to="/profile" 
                      className="block font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/order-history" 
                      className="block font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Order History
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="block font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100 flex items-center justify-between"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="font-medium text-red-600 hover:text-red-700 transition-colors py-2 border-b border-gray-100 flex items-center w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Login / Sign up
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;