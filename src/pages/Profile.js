import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEye, FiEyeOff, FiLogOut, 
  FiCheck, FiUpload, FiInfo, FiEdit2, FiEdit3, FiX, FiPieChart, FiDollarSign, 
  FiTrendingUp, FiAward, FiActivity, FiPlus, FiArrowUp, FiRefreshCw 
} from 'react-icons/fi';
import StatCard from '../components/StatCard';
import usePortfolio from '../hooks/usePortfolio';
import { toast } from 'react-toastify';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

function Profile() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // User data state
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Use the portfolio hook to fetch and manage portfolio data
  const { 
    portfolioValue,
    weeklyReturn,
    winRate,
    totalTrades,
    stocks,
    activeGoals,
    isLoading,
    error: portfolioError,
    refresh: refreshPortfolio
  } = usePortfolio();
  
  const [formData, setFormData] = useState(() => ({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Passionate investor with a focus on long-term growth and sustainable investments. Tech enthusiast exploring the intersection of finance and technology.",
    avatar: ""
  }));
  
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Set user data when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setUser(prev => ({
        ...prev,
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || ''
      }));
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Update form data when user data changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || prev.name,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const handleEdit = () => {
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      avatar: user.avatar
    }));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(prev => ({
        ...prev,
        ...formData
      }));
      
      // Update the current user's display name in auth context
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          displayName: formData.name
        };
        localStorage.setItem('finsightUser', JSON.stringify(updatedUser));
      }
      
      setIsEditing(false);
      
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg"
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
            >
              <FiLogOut className="mr-2" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-12"
        variants={staggerContainer}
      >
        {/* Profile Header */}
        <motion.div 
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100"
        >
          <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute -bottom-16 left-6">
              <div 
                onClick={handleAvatarClick}
                className={`relative group cursor-pointer ${isEditing ? 'hover:ring-4 hover:ring-blue-200' : ''} rounded-full p-1 bg-white transition-all duration-200`}
              >
                <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiUpload className="h-6 w-6 text-white" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <div className="absolute right-6 bottom-6">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <FiEdit2 className="mr-2" />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiCheck className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{isEditing ? formData.name : user.name}</h2>
                <p className="text-blue-600 flex items-center mt-1">
                  <FiMapPin className="mr-1" size={14} />
                  {isEditing ? formData.location : user.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Information Section */}
        <motion.div 
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100"
        >
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiInfo className="mr-2 text-blue-600" />
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your personal details and contact information
            </p>
          </div>
          
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                      <FiUser className="mr-2 text-blue-500" /> Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                      <FiMail className="mr-2 text-blue-500" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                      <FiPhone className="mr-2 text-blue-500" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
                      <FiMapPin className="mr-2 text-blue-500" /> Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label htmlFor="bio" className="text-sm font-medium text-gray-700 flex items-center">
                    <FiEdit3 className="mr-2 text-blue-500" /> About Me
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>

                {/* Password Change Section */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                    <FiLock className="mr-2 text-blue-500" />
                    Change Password
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 mb-4">
                    Leave these fields empty to keep your current password
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="current-password"
                          name="currentPassword"
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="new-password"
                          name="newPassword"
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirm-password"
                          name="confirmPassword"
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCurrentPassword(!showCurrentPassword);
                          setShowNewPassword(!showNewPassword);
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {showCurrentPassword || showNewPassword || showConfirmPassword ? (
                          <>
                            <FiEyeOff className="mr-1.5" /> Hide Passwords
                          </>
                        ) : (
                          <>
                            <FiEye className="mr-1.5" /> Show Passwords
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center">
                    <FiUser className="mr-2 text-blue-500" /> Full Name
                  </div>
                  <div className="text-base text-gray-900 font-medium">
                    {user.name}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center">
                    <FiMail className="mr-2 text-blue-500" /> Email Address
                  </div>
                  <div className="text-base text-gray-900 font-medium">
                    {user.email}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center">
                    <FiPhone className="mr-2 text-blue-500" /> Phone
                  </div>
                  <div className="text-base text-gray-900 font-medium">
                    {user.phone}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500 flex items-center">
                    <FiMapPin className="mr-2 text-blue-500" /> Location
                  </div>
                  <div className="text-base text-gray-900 font-medium">
                    {user.location}
                  </div>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <div className="text-sm font-medium text-gray-500 flex items-center">
                    <FiInfo className="mr-2 text-blue-500" /> About
                  </div>
                  <div className="text-base text-gray-700 leading-relaxed">
                    {user.bio}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div 
          className="mt-8"
          variants={fadeIn}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Portfolio Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<FiDollarSign className="h-6 w-6" />} 
              title="Portfolio Value" 
              value={`$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
              change={`${weeklyReturn >= 0 ? '+' : ''}${weeklyReturn.toFixed(2)}% this week`} 
              isPositive={weeklyReturn >= 0} 
            />
            <StatCard 
              icon={<FiTrendingUp className="h-6 w-6" />} 
              title="Weekly Return" 
              value={`${weeklyReturn >= 0 ? '+' : ''}${weeklyReturn.toFixed(2)}%`} 
              change={`${weeklyReturn >= 0 ? '▲' : '▼'} $${Math.abs(weeklyReturn * portfolioValue / 100).toFixed(2)}`} 
              isPositive={weeklyReturn >= 0} 
            />
            <StatCard 
              icon={<FiAward className="h-6 w-6" />} 
              title="Win Rate" 
              value={`${winRate.toFixed(1)}%`} 
              change={`${Math.round(winRate / 100 * totalTrades)} of ${totalTrades} trades`} 
              isPositive={winRate >= 50} 
            />
            <StatCard 
              icon={<FiActivity className="h-6 w-6" />} 
              title="Active Goals" 
              value={activeGoals.toString()} 
              change={`${Math.round((activeGoals / 5) * 100)}% of target`} 
              isPositive={activeGoals > 0} 
            />
          </div>
        </motion.div>

        {/* Portfolio Overview Section */}
        <motion.div 
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100"
        >
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiPieChart className="mr-2 text-blue-600" />
                  Portfolio Overview
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your investment portfolio at a glance
                </p>
              </div>
              <button 
                onClick={refreshPortfolio}
                disabled={isLoading}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                {isLoading ? (
                  <FiRefreshCw className="animate-spin mr-1 h-4 w-4" />
                ) : (
                  <FiRefreshCw className="mr-1 h-4 w-4" />
                )}
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Portfolio Value */}
              <motion.div 
                variants={fadeInUp}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Portfolio Value</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="mt-2 text-sm">
                      <span className={`flex items-center ${weeklyReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {weeklyReturn >= 0 ? (
                          <FiArrowUp className="mr-1" />
                        ) : (
                          <FiArrowUp className="mr-1 transform rotate-180" />
                        )}
                        {weeklyReturn >= 0 ? '+' : ''}{weeklyReturn.toFixed(2)}% this week
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FiDollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">All Time Return</span>
                    <span className={`font-medium ${weeklyReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {weeklyReturn >= 0 ? '+' : ''}{weeklyReturn.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Profit/Loss */}
              <motion.div 
                variants={fadeInUp}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Profit/Loss</p>
                    <p className={`text-2xl font-bold ${weeklyReturn >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
                      {weeklyReturn >= 0 ? '+' : ''}{weeklyReturn.toFixed(2)}%
                    </p>
                    <div className="flex items-center mt-2 text-sm">
                      <span className={weeklyReturn >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {weeklyReturn >= 0 ? '▲' : '▼'} ${Math.abs(weeklyReturn * portfolioValue / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FiTrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              {/* Win Rate */}
              <motion.div 
                variants={fadeInUp}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Win Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {winRate.toFixed(1)}%
                    </p>
                    <div className="flex items-center mt-2 text-sm">
                      <span className="text-purple-500">
                        {Math.round(winRate / 100 * totalTrades)} of {totalTrades} trades
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FiAward className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>

              {/* Total Trades */}
              <motion.div 
                variants={fadeInUp}
                className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Total Trades</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {totalTrades}
                    </p>
                    <div className="flex items-center mt-2 text-sm">
                      <span className="text-amber-500">
                        {Math.round(totalTrades / 30)} this month
                      </span>
                    </div>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <FiActivity className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div 
              variants={fadeIn}
              className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready to grow your portfolio?</h3>
                  <p className="mt-1 text-sm text-gray-600 max-w-lg">
                    Explore our curated investment opportunities and start building your financial future today.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/dashboard')}
                    className="w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <FiPlus className="mr-2" />
                    Explore Investments
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
