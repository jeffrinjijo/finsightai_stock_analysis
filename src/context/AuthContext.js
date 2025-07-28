import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create the context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onboarded, setOnboarded] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('finsightUser');
        const profileData = localStorage.getItem('finsightProfile');
        
        if (userData) {
          const user = JSON.parse(userData);
          const token = localStorage.getItem('finsightToken');
          
          if (token) {
            // Load profile data if exists
            if (profileData) {
              const profile = JSON.parse(profileData);
              setProfile(profile);
              setOnboarded(!!profile.onboarded);
            }
            
            setCurrentUser({
              ...user,
              onboarded: !!user.onboarded
            });
          } else {
            // Clear invalid session
            localStorage.removeItem('finsightUser');
            localStorage.removeItem('finsightProfile');
          }
        }
      } catch (err) {
        console.error('Failed to load user data', err);
        setError('Failed to load user data');
        // Clear corrupted data
        localStorage.removeItem('finsightUser');
        localStorage.removeItem('finsightToken');
        localStorage.removeItem('finsightProfile');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Complete onboarding function
  const completeOnboarding = useCallback((profileData) => {
    try {
      const user = JSON.parse(localStorage.getItem('finsightUser') || '{}');
      if (!user || !user.email) {
        throw new Error('No user found');
      }

      const updatedUser = { 
        ...user, 
        onboarded: true,
        name: profileData.name || user.name || user.email.split('@')[0]
      };
      
      // Save the updated user with onboarded status
      localStorage.setItem('finsightUser', JSON.stringify(updatedUser));
      
      const completeProfile = {
        ...profileData,
        email: user.email,
        name: updatedUser.name,
        onboarded: true,
        onboardedAt: new Date().toISOString()
      };
      
      // Save the profile data
      localStorage.setItem('finsightProfile', JSON.stringify(completeProfile));
      
      setCurrentUser(updatedUser);
      setProfile(completeProfile);
      setOnboarded(true);
      
      // Show success message
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError('Failed to complete onboarding: ' + error.message);
      toast.error('Failed to save profile. Please try again.');
      return false;
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, accept any non-empty email and password
      if (!email.trim() || !password.trim()) {
        throw new Error('Invalid email or password');
      }
      
      // Check for existing profile
      const existingProfile = JSON.parse(localStorage.getItem('finsightProfile') || '{}');
      const isOnboarded = !!existingProfile.onboarded;
      
      // Create a user object
      const user = { 
        email,
        name: existingProfile.name || email.split('@')[0],
        id: `user-${Date.now()}`,
        token: `demo-token-${Math.random().toString(36).substr(2, 9)}`,
        onboarded: isOnboarded
      };
      
      // Store user data and token
      localStorage.setItem('finsightUser', JSON.stringify(user));
      localStorage.setItem('finsightToken', user.token);
      
      // If no profile exists, create a default one
      if (!existingProfile || !existingProfile.email) {
        const newProfile = {
          email,
          name: email.split('@')[0],
          onboarded: false
        };
        localStorage.setItem('finsightProfile', JSON.stringify(newProfile));
        setProfile(newProfile);
      } else {
        setProfile(existingProfile);
      }
      
      setCurrentUser(user);
      setOnboarded(isOnboarded);
      return { success: true, user };
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup function
  const signup = useCallback(async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, accept any non-empty email and password
      if (!email.trim() || !password.trim()) {
        throw new Error('Invalid email or password');
      }
      
      // Create a user object
      const user = { 
        email,
        name: name || email.split('@')[0],
        id: `user-${Date.now()}`,
        token: `demo-token-${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Store user data and token
      localStorage.setItem('finsightUser', JSON.stringify(user));
      localStorage.setItem('finsightToken', user.token);
      
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear all auth-related data
      localStorage.removeItem('finsightUser');
      localStorage.removeItem('finsightToken');
      localStorage.removeItem('finsightProfile');
      
      // Reset user state
      setCurrentUser(null);
      setError(null);
      
      // Small delay for a smoother transition
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout');
      throw err;
    }
  }, []);

  // Clear errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get user profile data
  const getProfile = useCallback(() => {
    if (!currentUser) return null;
    try {
      return JSON.parse(localStorage.getItem('finsightProfile') || '{}');
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }, [currentUser]);

  const value = {
    currentUser,
    loading,
    error,
    onboarded,
    profile,
    login,
    signup,
    logout,
    clearError,
    completeOnboarding,
    getProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export AuthProvider as a named export and AuthContext as default
export default AuthContext;
