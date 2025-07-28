import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const fetchNews = async (symbols = []) => {
  // In a real app, you would fetch news from a financial news API
  // This is a mock implementation
  const mockNews = [
    {
      id: 1,
      title: 'Tech Stocks Rally as Market Shows Strong Recovery',
      source: 'Financial Times',
      date: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      url: '#',
      relatedStocks: ['AAPL', 'MSFT', 'GOOGL']
    },
    {
      id: 2,
      title: 'Federal Reserve Signals Potential Rate Cuts in 2024',
      source: 'Bloomberg',
      date: '5 hours ago',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      url: '#',
      relatedStocks: []
    },
    {
      id: 3,
      title: 'Amazon Announces New AI-Powered Shopping Features',
      source: 'TechCrunch',
      date: '8 hours ago',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      url: '#',
      relatedStocks: ['AMZN']
    },
    {
      id: 4,
      title: 'Microsoft Expands Cloud Services with New Data Centers',
      source: 'The Verge',
      date: '1 day ago',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      url: '#',
      relatedStocks: ['MSFT']
    },
    {
      id: 5,
      title: 'Alphabet Reports Strong Q2 Earnings, Beating Estimates',
      source: 'CNBC',
      date: '1 day ago',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      url: '#',
      relatedStocks: ['GOOGL']
    }
  ];

  // Filter news based on watched stocks if any are provided
  if (symbols.length > 0) {
    return mockNews.filter(news => 
      news.relatedStocks.some(symbol => symbols.includes(symbol))
    );
  }
  
  // Return all news if no specific stocks are being watched
  return mockNews;
};

const FinancialNews = ({ watchedStocks = [] }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['financialNews', watchedStocks.join(',')],
    queryFn: () => fetchNews(watchedStocks.map(s => s.symbol || s['1. symbol'])),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  const displayedNews = showAll ? news : news.slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial News</h3>
        {watchedStocks.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
            Filtered by watchlist
          </span>
        )}
      </div>
      
      {news.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No recent news found for your watchlist</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedNews.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80x80?text=News';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {item.title}
                        </h4>
                        <button 
                          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                          className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                          <svg 
                            className={`w-5 h-5 transform transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{item.source}</span>
                        <span className="mx-2">•</span>
                        <span>{item.date}</span>
                        
                        {item.relatedStocks && item.relatedStocks.length > 0 && (
                          <div className="ml-3 flex items-center">
                            <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-xs font-medium">
                              {item.relatedStocks.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {expandedId === item.id && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <p className="mb-2">
                            {item.title} - Read the full article for more details about this developing story.
                          </p>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
                          >
                            Read more
                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {news.length > 3 && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {showAll ? 'Show less' : `Show all ${news.length} articles`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FinancialNews;
