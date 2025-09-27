import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiInfo } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import TechStockAnalysis from '../components/TechStockAnalysis';

const TechStocks = () => {
  console.log('TechStocks component rendered');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tech Stock Analysis
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time analysis of major technology stocks including Apple, Microsoft, Google, and Amazon
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <TechStockAnalysis />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center mb-3">
              <FiBarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Market Overview</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Track the performance of major tech stocks with real-time data and technical analysis. 
              Our algorithms analyze price movements, volume trends, and market indicators to provide 
              actionable insights.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/50">
            <div className="flex items-center mb-3">
              <FiInfo className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200">Analysis Methodology</h3>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Our analysis includes moving averages (20, 50, 200-day), RSI, and volume analysis. 
              Data is updated every 5 minutes during market hours. 
              <span className="block mt-2 text-xs opacity-80">
                Note: This is for informational purposes only and not financial advice.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStocks;
