import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const OnboardingGuard = ({ children }) => {
  const { currentUser, loading, onboarded } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!currentUser) {
        // Store the current location to redirect back after login
        const redirectPath = location.pathname !== '/' ? location.pathname : '/app';
        navigate('/login', { state: { from: { pathname: redirectPath } }, replace: true });
        return;
      }

      try {
        // Check if user is already onboarded
        if (!onboarded && !location.pathname.startsWith('/onboarding')) {
          // Redirect to onboarding with the intended destination
          navigate('/onboarding', { 
            state: { 
              from: location.state?.from || { pathname: '/app' } 
            }, 
            replace: true 
          });
          return;
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    if (!loading) {
      checkOnboardingStatus();
    }
  }, [currentUser, loading, location, navigate, onboarded]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If we're on the onboarding page, don't render the layout
  if (location.pathname.startsWith('/onboarding')) {
    return children;
  }

  // For all other protected routes, render the layout with children
  return children;
};

export default OnboardingGuard;
