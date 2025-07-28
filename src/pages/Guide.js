import React, { useState } from 'react';
import { FiArrowLeft, FiSearch, FiBookOpen, FiDollarSign, FiTrendingUp, FiShield, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EducationalResources from '../components/EducationalResources';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Guide = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: <FiBookOpen className="mr-2" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <FiTrendingUp className="mr-2" /> },
    { id: 'trading', name: 'Trading Guide', icon: <FiDollarSign className="mr-2" /> },
    { id: 'risk', name: 'Risk Management', icon: <FiShield className="mr-2" /> },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Investment Education Center</h1>
            <p className="text-xl text-blue-100 mb-8">Master the markets with our comprehensive investment guides and resources</p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for investment topics, strategies, or guides..."
                  className="w-full pl-12 pr-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-12">
        {/* Categories */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              variants={fadeIn}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-full transition-all ${activeCategory === category.id 
                ? 'bg-white text-blue-600 shadow-lg' 
                : 'bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 hover:shadow-md'}`}
            >
              {category.icon}
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12"
        >
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <FiCheckCircle size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Beginner's Investment Guide</h2>
            </div>
            <p className="text-gray-600 mb-6">Start your investment journey with our step-by-step guide designed for beginners. Learn the fundamentals and build a strong foundation.</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Getting Started</span>
              <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">Beginner Friendly</span>
              <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">5 min read</span>
            </div>
          </div>
          <div className="bg-gray-50 p-6 border-t border-gray-100">
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              Start Learning <span className="ml-2">→</span>
            </button>
          </div>
        </motion.div>
        
        {/* Educational Resources */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <EducationalResources />
        </motion.div>
      </div>
    </div>
  );
};

export default Guide;
