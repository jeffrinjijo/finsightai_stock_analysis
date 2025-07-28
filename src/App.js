// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useContext, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Public Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PricingPage from "./pages/PricingPage";
import Onboarding from "./pages/Onboarding";
import APITest from "./components/APITest";

// Protected Pages - Ensure these files exist in the pages directory
import Dashboard from "./pages/Dashboard";
import Simulate from "./pages/Simulate";
import Profile from "./pages/Profile";
import Goals from "./pages/Goals";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import TechStocks from "./pages/TechStocks";

// Layout & Auth
import Layout from "./components/Layout";
import OnboardingGuard from "./components/OnboardingGuard";
import { AuthContext, useAuth, AuthProvider } from "./context/AuthContext";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected route wrapper
const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const { currentUser, loading, onboarded } = useAuth();
  const location = useLocation();

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!currentUser) {
    console.log('ProtectedRoute - No user, redirecting to login');
    // Store the current location to redirect back after login
    const redirectUrl = location.pathname + (location.search || '');
    // Only store the redirect URL if it's not already the login page
    if (!['/login', '/signup'].includes(location.pathname)) {
      localStorage.setItem('redirectUrl', redirectUrl);
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If onboarding is required but not completed, redirect to onboarding
  if (requireOnboarding && !onboarded && !location.pathname.startsWith('/onboarding')) {
    console.log('ProtectedRoute - Onboarding required, redirecting to /onboarding');
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If user is logged in and onboarding is complete (if required), render children
  return children;
};

// Public route wrapper
const PublicRoute = ({ children, allowAuthenticated = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // If user is logged in and this is a public-only page, redirect to home
  if (currentUser && !allowAuthenticated && location.pathname !== '/welcome') {
    console.log('PublicRoute - Redirecting to /home (user is logged in)');
    return <Navigate to="/home" state={{ from: location }} replace />;
  }
  
  // If user is not logged in but trying to access a protected page, allow it
  // as the ProtectedRoute will handle the redirection to login
  if (!currentUser && !['/login', '/signup', '/', '/welcome'].includes(location.pathname)) {
    return children;
  }
  
  // For all other cases, render the children
  return children;
};

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes - Accessible to all */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            <Route path="/pricing" element={
              <PublicRoute allowAuthenticated={true}>
                <PricingPage />
              </PublicRoute>
            } />
            <Route path="/onboarding" element={
              <PublicRoute allowAuthenticated={true}>
                <Onboarding />
              </PublicRoute>
            } />
            <Route path="/api-test" element={<APITest />} />
            
            {/* Root route - Redirects based on auth status */}
            <Route path="/" element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            } />
            
            {/* Protected Routes - Require authentication */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulate" element={<Simulate />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/tech-stocks" element={<TechStocks />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Default redirect for protected routes */}
              <Route index element={<Navigate to="/home" replace />} />
            </Route>
            
            {/* Catch all other routes */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">Page not found</p>
                  <button 
                    onClick={() => window.history.back()}
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
