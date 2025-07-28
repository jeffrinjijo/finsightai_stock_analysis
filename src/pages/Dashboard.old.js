import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Link } from "react-router-dom";
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiAward, 
  FiDollarSign, 
  FiActivity,
  FiTarget,
  FiArrowUpRight,
  FiRefreshCw,
  FiMenu,
  FiX,
  FiLogOut,
  FiPieChart,
  FiBookOpen,
  FiClock,
  FiDollarCircle,
  FiTrendingUp as FiTrendingUpIcon,
  FiPieChart as FiPieChartIcon
} from "react-icons/fi";

function Dashboard() {
  // State
  const experience = localStorage.getItem("experienceLevel") || "Beginner";
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { name: 'Dashboard', icon: <FiBarChart2 className="mr-2" />, path: '/dashboard' },
    { name: 'Portfolio', icon: <FiPieChartIcon className="mr-2" />, path: '/portfolio' },
    { name: 'Markets', icon: <FiDollarSign className="mr-2" />, path: '/markets' },
    { name: 'News', icon: <FiBookOpen className="mr-2" />, path: '/news' },
  ];

  // Chart data
  const chartData = [
    { name: 'Mon', value: 40 },
    { name: 'Tue', value: 30 },
    { name: 'Wed', value: 20 },
    { name: 'Thu', value: 27 },
    { name: 'Fri', value: 18 },
    { name: 'Sat', value: 23 },
    { name: 'Sun', value: 34 },
  ];

  // Community leaderboard data
  const leaderboardData = [
    { id: 1, name: 'Alex Johnson', gain: 12500, avatar: 'AJ' },
    { id: 2, name: 'Maria Garcia', gain: 11800, avatar: 'MG' },
    { id: 3, name: 'David Kim', gain: 10200, avatar: 'DK' },
    { id: 4, name: 'Sarah Wilson', gain: 9800, avatar: 'SW' },
    { id: 5, name: 'James Brown', gain: 8750, avatar: 'JB' },
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const experience = localStorage.getItem("experienceLevel") || "Beginner";
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const navLinks = [
    { name: 'Dashboard', icon: <FiBarChart2 className="mr-2" />, path: '/dashboard' },
    { name: 'Portfolio', icon: <FiPieChartIcon className="mr-2" />, path: '/portfolio' },
    { name: 'Markets', icon: <FiDollarSign className="mr-2" />, path: '/markets' },
    { name: 'News', icon: <FiBookOpen className="mr-2" />, path: '/news' },
  ];

  const data = {
    Beginner: {
      trust: 58,
      risk: "Low",
      stocks: [
        { name: "HDFC Bank", change: "+1.8%" },
        { name: "Infosys", change: "+2.3%" },
        { name: "ITC", change: "+1.5%" },
      ],
      profit: "+₹12.00",
    },
    Intermediate: {
      trust: 72,
      risk: "Moderate",
      stocks: [
        { name: "Zomato", change: "+5.7%" },
        { name: "Tata Motors", change: "+4.4%" },
        { name: "Adani Green", change: "+3.9%" },
      ],
      profit: "+₹57.00",
    },
    Expert: {
      trust: 88,
      risk: "High",
      stocks: [
        { name: "Nykaa", change: "+12.3%" },
        { name: "Paytm", change: "+9.8%" },
        { name: "Delta Corp", change: "+8.1%" },
      ],
      profit: "+₹123.00",
    },
  };

  const { trust, risk, stocks, profit } = data[experience];

  const trustData = [
    { date: "Jul 1", score: trust - 15 },
    { date: "Jul 2", score: trust - 10 },
    { date: "Jul 3", score: trust - 5 },
    { date: "Jul 4", score: trust - 2 },
    { date: "Jul 5", score: trust },
  ];

  const profitData = [
    { day: "Mon", profit: 20 },
    { day: "Tue", profit: 35 },
    { day: "Wed", profit: -15 },
    { day: "Thu", profit: 45 },
    { day: "Fri", profit: 10 },
  ];



  // Chart data
  const chartData = [
    { name: 'Mon', value: 40 },
    { name: 'Tue', value: 30 },
    { name: 'Wed', value: 20 },
    { name: 'Thu', value: 27 },
    { name: 'Fri', value: 18 },
    { name: 'Sat', value: 23 },
    { name: 'Sun', value: 34 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      {/* Navigation Bar */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-md text-gray-800' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/dashboard" className="flex items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-blue-400 rounded-full opacity-75 blur"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                    <FiTrendingUp className={`h-5 w-5 text-white`} />
                  </div>
                </div>
                <span className={`ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent ${isScrolled ? '' : 'text-white'}`}>
                  FinSight AI
                </span>
              </Link>
            </motion.div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-600 hover:bg-gray-100 hover:text-blue-600' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full ${
                  isScrolled 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-white/90 hover:bg-white/10'
                }`}
                onClick={handleRefresh}
              >
                <FiRefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full ${
                  isScrolled 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-white/90 hover:bg-white/10'
                }`}
                onClick={handleLogout}
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                className="md:hidden p-2 rounded-lg focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <FiX className={`h-6 w-6 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
                ) : (
                  <FiMenu className={`h-6 w-6 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      {link.icon}
                      {link.name}
                    </div>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <div className="flex items-center">
                    <FiLogOut className="mr-2" />
                    Logout
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Add padding to account for fixed header */}
      <div className="pt-16">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { 
                title: 'Portfolio Value', 
                value: '₹1,24,856', 
                change: '+2.4%', 
                icon: <FiDollarCircle className="w-6 h-6" />,
                trend: 'up',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-100'
              },
              { 
                title: 'Today\'s Gain', 
                value: '₹2,856', 
                change: '+1.2%', 
                icon: <FiTrendingUpIcon className="w-6 h-6" />,
                trend: 'up',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-100'
              },
              { 
                title: 'This Month', 
                value: '₹12,450', 
                change: '+5.8%', 
                icon: <FiPieChartIcon className="w-6 h-6" />,
                trend: 'up',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-100'
              },
              { 
                title: 'Active Stocks', 
                value: '8', 
                change: '2 new', 
                icon: <FiClock className="w-6 h-6" />,
                trend: 'info',
                color: 'text-amber-600',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-100'
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`bg-white p-6 rounded-xl shadow-sm border ${stat.borderColor} hover:shadow-md transition-all duration-300 h-full`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <div className={`text-sm font-medium mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                      {stat.change} {stat.trend === 'up' && '↑'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Welcome Banner */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 right-10 w-20 h-20 bg-yellow-400/20 rounded-full -mb-10 -mr-5"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-3">
                    <div className="flex items-center mb-3 sm:mb-0 sm:mr-4">
                      <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-2 rounded-lg shadow-lg">
                        <FiTrendingUp className="text-2xl text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100 ml-3">
                        Welcome back, {experience}!
                      </h2>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
                      👋 Investor Dashboard
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
                    Here's your personalized investment dashboard. Track your portfolio, discover new opportunities, and stay ahead of the market with real-time insights and analytics.
                  </p>
                  
                  <motion.div 
                    className="mt-6 flex flex-wrap gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2.5 bg-white text-indigo-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                    >
                      <FiBarChart2 className="mr-2" />
                      View Portfolio
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2.5 bg-transparent border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center"
                    >
                      <FiTrendingUp className="mr-2" />
                      Explore Markets
                    </motion.button>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="hidden lg:block"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-400/20 rounded-full blur-xl"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="text-sm text-green-300">Live Market Data</div>
                      </div>
                      <div className="mt-4 text-2xl font-bold">+2.4% Today</div>
                      <div className="text-blue-100 text-sm">Your portfolio is growing!</div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Stats Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { label: 'Total Value', value: '₹1,24,856', change: '+2.4%', trend: 'up' },
                  { label: 'Today\'s Gain', value: '₹2,856', change: '+1.2%', trend: 'up' },
                  { label: 'This Month', value: '₹12,450', change: '+5.8%', trend: 'up' },
                  { label: 'Active Stocks', value: '8', change: '2 new', trend: 'info' },
                ].map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="text-sm text-blue-100 mb-1">{stat.label}</div>
                    <div className="text-xl font-bold mb-1">{stat.value}</div>
                    <div className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-300' : 'text-blue-200'
                    }`}>
                      {stat.change} {stat.trend === 'up' && '↑'}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        
        {/* Quick Actions */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
              <p className="text-sm text-gray-500 mt-1">Common tasks to manage your investments</p>
            </div>
            <button className="text-sm bg-white hover:bg-gray-50 text-blue-600 font-medium px-4 py-2 rounded-lg border border-gray-200 transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Portfolio Analysis",
                description: "Get detailed insights",
                icon: <FiBarChart2 className="text-2xl" />,
                color: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                hoverColor: "hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-100",
                to: "/portfolio/analysis"
              },
              {
                title: "Goal Tracker",
                description: "Track financial goals",
                icon: <FiTarget className="text-2xl" />,
                color: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
                hoverColor: "hover:shadow-lg hover:-translate-y-1 hover:shadow-purple-100",
                to: "/goals"
              },
              {
                title: "Market Watch",
                description: "Real-time updates",
                icon: <FiTrendingUp className="text-2xl" />,
                color: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
                hoverColor: "hover:shadow-lg hover:-translate-y-1 hover:shadow-green-100",
                to: "/markets"
              },
              {
                title: "Risk Analyzer",
                description: "Assess risk level",
                icon: <FiActivity className="text-2xl" />,
                color: "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
                hoverColor: "hover:shadow-lg hover:-translate-y-1 hover:shadow-amber-100",
                to: "/risk-analyzer"
              }
            ].map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={action.to}
                  className={`group bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all duration-300 ${action.hoverColor} h-full block`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-1 group-hover:text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500 group-hover:text-gray-600">
                        {action.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg transition-colors duration-300 ${action.color}`}>
                      {action.icon}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Get Started
                    <FiArrowUpRight className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Trust Score */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Trust Score
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{trust}%</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <FiActivity className="text-xl" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Based on your activity</span>
                <div className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  {trust > 70 ? 'Excellent' : trust > 40 ? 'Good' : 'Needs Work'}
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${trust}%` }}
                ></div>
              </div>
            </motion.div>

            {/* Risk Profile */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Risk Appetite
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2 capitalize">{risk.toLowerCase()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl text-green-600">
                  <FiBarChart2 className="text-xl" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Tolerance Level</span>
                  <span className="text-xs font-medium">
                    {risk === 'Low' ? '1/5' : risk === 'Moderate' ? '3/5' : '5/5'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      risk === 'Low' ? 'bg-green-500 w-1/5' : 
                      risk === 'Moderate' ? 'bg-yellow-500 w-3/5' : 
                      'bg-red-500 w-full'
                    }`}
                  ></div>
                </div>
              </div>
            </motion.div>

            {/* Portfolio Value */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    Portfolio Value
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">₹{(trust * 1000).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                  <FiDollarSign className="text-xl" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center">
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <FiArrowUpRight className="mr-1" />
                  {trust > 70 ? '12.5%' : trust > 40 ? '8.2%' : '3.7%'} this month
                </span>
              </div>
            </motion.div>

            {/* Active Investments */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                    Active Investments
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {experience === 'Beginner' ? '3' : experience === 'Intermediate' ? '7' : '12'}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <FiTrendingUp className="text-xl" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex -space-x-2">
                  {Array.from({ length: experience === 'Beginner' ? 3 : experience === 'Intermediate' ? 5 : 4 }).map((_, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white"
                      style={{ zIndex: 10 - i }}
                    ></div>
                  ))}
                  {experience !== 'Beginner' && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                      +{experience === 'Intermediate' ? '2' : '8'}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FOMO Stocks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg flex items-center">
              <FiTrendingUp className="mr-2 text-red-500" />
              Trending Stocks
            </h3>
            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">Live</span>
          </div>
          <ul className="space-y-3">
            {stocks.map((stock, index) => (
              <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                <span className="font-medium">{stock.name}</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  stock.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {stock.change}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Simulation CTA */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-sm mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to test your investment strategy?</h3>
            <p className="text-gray-600 mb-6">Try our risk-free simulation with virtual money and see how your investments perform in real market conditions.</p>
            <Link to="/simulate">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                Start Investment Simulation
              </button>
            </Link>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trust Score Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Trust Score Trend</h3>
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">Weekly</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trustData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#4f46e5' }}
                    activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Simulation Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FiDollarSign className="mr-2 text-green-500" />
                  Weekly Profit Simulation
                </h3>
                <p className="text-sm text-gray-500 mt-1">Last 7 days performance</p>
              </div>
              <motion.span 
                className="text-xs px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-full border border-green-100 font-medium flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Live Simulation
              </motion.span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={profitData} 
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  barSize={24}
                >
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.9}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#f0f0f0" 
                    vertical={false} 
                  />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Inter' }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Inter' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    tickMargin={10}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-green-600 font-semibold">
                              ${payload[0].value.toFixed(2)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ fill: '#f0fdf4', radius: 8 }}
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="url(#profitGradient)" 
                    radius={[4, 4, 0, 0]}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiAward className="mr-2 text-yellow-500" />
              Community Leaderboard
            </h3>
            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">Weekly</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Priya', gain: 13200, avatar: '👩‍💼' },
              { name: 'Jeffrin', gain: 10400, avatar: '👨‍💻' },
              { name: 'Karan', gain: 9800, avatar: '👨‍💼' },
              { name: 'Aisha', gain: 8750, avatar: '👩‍🎨' },
              { name: 'Rahul', gain: 7650, avatar: '👨‍🔧' },
            ].map((user, index) => (
              <motion.div 
                key={index} 
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg mr-3">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {index === 0 ? '🏆 ' : ''}
                    {index === 1 ? '🥈 ' : ''}
                    {index === 2 ? '🥉 ' : ''}
                    ₹{user.gain.toLocaleString()} gain
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  index < 3 ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-700'
                }`}>
                  #{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
