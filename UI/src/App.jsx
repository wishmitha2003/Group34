import React, { useEffect, Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useRouteError, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Categories = lazy(() => import('./pages/Categories'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/Signup'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Error Boundary Component
const ErrorBoundary = () => {
  const error = useRouteError();
  console.error('Route error:', error);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-4">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        <div className="bg-gray-100 p-3 rounded text-sm text-gray-700 mb-6">
          <code>{error?.statusText || error?.message || 'Unknown error'}</code>
        </div>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

// 404 Not Found Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center max-w-md">
      <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🔍</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Page not found</h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a 
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Return to Homepage
      </a>
    </div>
  </div>
);

// Custom Hook for Dynamic Page Titles
const useRouteTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    const routeTitles = {
      '/': 'Home - GenZsport',
      '/categories': 'Categories - GenZsport',
      '/cart': 'Shopping Cart - GenZsport',
      '/login': 'Login - GenZsport',
      '/signup': 'Sign Up - GenZsport',
      '/checkout': 'Checkout - GenZsport',
      '/profile': 'My Profile - GenZsport',
      '/order-history': 'Order History - GenZsport',
      '/wishlist': 'My Wishlist - GenZsport',
      '/settings': 'Settings - GenZsport',
    };
    
    const title = routeTitles[location.pathname] || 'GenZsport';
    document.title = title;
  }, [location.pathname]);
};

// Custom Hook for Scroll to Top on Navigation
const useScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Layout Wrapper Component - This ensures hooks are used within providers
const LayoutWrapper = () => {
  useRouteTitle();
  useScrollToTop();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

// Router Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
    errorElement: <ErrorBoundary />,
    children: [
      { 
        index: true, 
        element: <Home /> 
      },
      { 
        path: 'categories/:category', 
        element: <Categories /> 
      },
      { 
        path: 'categories', 
        element: <Categories /> 
      },
      { 
        path: 'cart', 
        element: <Cart /> 
      },
      { 
        path: 'login', 
        element: <Login /> 
      },
      { 
        path: 'signup', 
        element: <SignUp /> 
      },
      { 
        path: 'checkout', 
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'order-history', 
        element: (
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wishlist', 
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'settings', 
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '*', 
        element: <NotFound /> 
      },
    ],
  },
]);

// Main App Component
export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;