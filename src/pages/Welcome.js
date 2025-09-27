import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, 
  FiBarChart2, 
  FiShield, 
  FiZap, 
  FiTrendingUp, 
  FiUser, 
  FiLock, 
  FiExternalLink,
  FiDollarSign,
  FiTrendingUp as FiTrendingUpIcon,
  FiTrendingDown as FiTrendingDownIcon
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import useStocks from '../hooks/useStocks';

// Modern card component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-10 hover:border-opacity-30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

// Default stock symbols to show in the ticker
const DEFAULT_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];

// Fallback stock data in case API is rate limited
const FALLBACK_STOCKS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.34,
    change: 2.15,
    changePercent: 1.24,
    volume: 45678901,
    open: 173.50,
    high: 175.85,
    low: 173.25,
    previousClose: 173.19,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 315.76,
    change: -1.23,
    changePercent: -0.39,
    volume: 23456789,
    open: 317.25,
    high: 318.50,
    low: 315.10,
    previousClose: 316.99,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2689.85,
    change: 15.75,
    changePercent: 0.59,
    volume: 12345678,
    open: 2675.30,
    high: 2695.25,
    low: 2670.45,
    previousClose: 2674.10,
    lastUpdated: new Date().toISOString()
  }
];

// Format price with proper currency formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Stock ticker component with improved error handling and loading states
const StockTicker = ({ stocks = [], isLoading, error, onStockClick }) => {
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-20 bg-gray-800/50 rounded-lg">
        <div className="animate-pulse flex space-x-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 text-red-200 p-4 rounded-lg">
        <p className="text-sm">Error loading stock data: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // If no stocks, show empty state
  if (!stocks || stocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No stock data available. Try again later.
      </div>
    );
  }

  // Normal state - render actual stock data
  return (
    <div className="flex space-x-6 overflow-x-auto py-4 px-2 scrollbar-hide">
      {stocks.map((stock) => {
        if (!stock) return null;
        
        const change = stock.change || 0;
        const changePercent = stock.changePercent || 0;
        const isPositive = change >= 0;
        
        // Format the price with 2 decimal places
        const formattedPrice = formatPrice(stock.price || 0);
        
        return (
          <div 
            key={stock.symbol} 
            className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
            onClick={() => onStockClick && onStockClick(stock.symbol)}
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{stock.symbol}</div>
              <div className="text-xs text-gray-400 truncate">{stock.name}</div>
            </div>
            <div className="text-right ml-4">
              <div className="font-medium text-white">{formattedPrice}</div>
              <div className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'} flex items-center justify-end`}>
                {isPositive ? (
                  <FiTrendingUpIcon className="mr-1" size={14} />
                ) : (
                  <FiTrendingDownIcon className="mr-1" size={14} />
                )}
                {Math.abs(parseFloat(changePercent)).toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Welcome = () => {
  const navigate = useNavigate();
  const [stockSymbols] = useState(DEFAULT_STOCKS);
  const { data: stocks = [], isLoading, error, refresh } = useStocks(stockSymbols);
  
  // Use fallback data if no stocks are loaded
  const displayStocks = (stocks && stocks.length > 0) ? stocks : FALLBACK_STOCKS;
  
  // Log the stocks data for debugging
  useEffect(() => {
    console.log('Stocks data:', { stocks: displayStocks, isLoading, error });
  }, [displayStocks, isLoading, error]);

  // Handle stock click to navigate to stock detail page
  const handleStockClick = (symbol) => {
    navigate(`/stocks/${symbol}`);
  };

  // Format number with commas and 2 decimal places
  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format percentage change
  const formatPercent = (value) => {
    if (value === null || value === undefined) return { formatted: 'N/A', isPositive: true };
    const num = parseFloat(value);
    const isPositive = num >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <FiTrendingUpIcon className="mr-1" /> : <FiTrendingDownIcon className="mr-1" />}
        {Math.abs(num).toFixed(2)}%
      </span>
    );
  };

  const handlePrivacy = () => {
    window.open('/privacy', '_blank');
  };

  const handleTerms = () => {
    window.open('/terms', '_blank');
  };

  const handleContact = () => {
    window.location.href = 'mailto:support@finsightai.com';
  };

  const features = [
    {
      icon: <FiBarChart2 className="w-5 h-5 text-white" />,
      title: 'Smart Analytics',
      description: 'AI-powered insights for better investment decisions'
    },
    {
      icon: <FiShield className="w-5 h-5 text-white" />,
      title: 'Risk Management',
      description: 'Personalized risk assessment tools'
    },
    {
      icon: <FiZap className="w-5 h-5 text-white" />,
      title: 'Real-time Data',
      description: 'Live market data and trends'
    },
    {
      icon: <FiTrendingUp className="w-5 h-5 text-white" />,
      title: 'Performance',
      description: 'Track your investment growth'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Stock Ticker */}
      <div className="bg-black bg-opacity-50 py-2 border-b border-gray-800 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="w-full">
            <StockTicker 
              stocks={stocks} 
              isLoading={isLoading} 
              error={error}
              onStockClick={(symbol) => navigate(`/stocks/${symbol}`)}
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                FinSight AI
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Smart Investing
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              Powered by AI
            </span>
          </motion.h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Make smarter investment decisions with our AI-powered analytics platform. 
            Get real-time insights and personalized recommendations.
          </p>
          
          {/* Stock Ticker */}
          <div className="mb-12 bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Market Overview</h3>
            <StockTicker 
              stocks={displayStocks} 
              isLoading={isLoading} 
              error={error} 
              onStockClick={handleStockClick}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 rounded-lg text-white font-medium hover:opacity-90 transition"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="border border-gray-700 px-8 py-3 rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to make informed investment decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                  <FiTrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">FinSight AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered investment analytics platform for smarter trading decisions.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><button onClick={handlePrivacy} className="text-gray-400 hover:text-white transition flex items-center">Privacy <FiExternalLink className="ml-1 w-3 h-3" /></button></li>
                <li><button onClick={handleTerms} className="text-gray-400 hover:text-white transition flex items-center">Terms <FiExternalLink className="ml-1 w-3 h-3" /></button></li>
                <li><button onClick={handleContact} className="text-gray-400 hover:text-white transition flex items-center">Contact <FiExternalLink className="ml-1 w-3 h-3" /></button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} FinSight AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
