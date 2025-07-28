import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StockCard = ({ ticker, name, change, price, sector, delay }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{ticker}</h3>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
              {sector}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
        </div>
        <div className="text-right">
          <p className="font-medium dark:text-gray-100">${price.toFixed(2)}</p>
          <div className={`flex items-center justify-end space-x-1 ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function FomoStocks() {
  const trendingStocks = [
    {
      ticker: "TSLA",
      name: "Tesla, Inc.",
      price: 876.75,
      change: 5.3,
      sector: "Auto"
    },
    {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      price: 298.21,
      change: -1.2,
      sector: "Tech"
    },
    {
      ticker: "GME",
      name: "GameStop Corp.",
      price: 145.12,
      change: 12.7,
      sector: "Retail"
    },
    // SaaS Stocks
    {
      ticker: "CRM",
      name: "Salesforce, Inc.",
      price: 245.67,
      change: 3.2,
      sector: "SaaS"
    },
    {
      ticker: "SHOP",
      name: "Shopify Inc.",
      price: 1450.32,
      change: -2.1,
      sector: "SaaS"
    },
    {
      ticker: "NOW",
      name: "ServiceNow, Inc.",
      price: 678.90,
      change: 1.8,
      sector: "SaaS"
    }
  ];

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Stocks</h2>
        <span className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Live
        </span>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Top Movers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingStocks
              .filter(stock => stock.sector !== 'SaaS')
              .map((stock, index) => (
                <StockCard
                  key={stock.ticker}
                  {...stock}
                  delay={0.1 * index}
                />
              ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">SaaS Leaders</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingStocks
              .filter(stock => stock.sector === 'SaaS')
              .map((stock, index) => (
                <StockCard
                  key={stock.ticker}
                  {...stock}
                  delay={0.1 * index}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
