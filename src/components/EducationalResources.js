import React from 'react';
import { FiInfo, FiDollarSign, FiCompass, FiBookOpen } from 'react-icons/fi';

const EducationalResources = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FiBookOpen className="mr-2 text-blue-600" />
        Investor Education Center
      </h2>
      
      <div className="space-y-8">
        {/* Getting Started Section */}
        <section className="bg-blue-50 p-5 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
            <FiCompass className="mr-2" /> Getting Started with Investing
          </h3>
          <p className="text-gray-700 mb-4">
            Welcome to your investment journey! Our platform is designed to make stock market investing accessible to everyone. 
            Whether you're a complete beginner or an experienced investor, these resources will help you make informed decisions.
          </p>
        </section>

        {/* Platform Features */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <FiInfo className="mr-2 text-green-600" />
            Understanding Our Tools
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800">Interactive Charts</h4>
              <p className="text-gray-600 text-sm mt-1">
                Hover over any data point to see detailed information. Use the time period selectors to analyze different time frames.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800">Stock Information Cards</h4>
              <p className="text-gray-600 text-sm mt-1">
                Each stock card shows key metrics. Click on any stock to see more detailed analysis and historical data.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800">AI Assistant</h4>
              <p className="text-gray-600 text-sm mt-1">
                Our AI assistant can answer your investment questions, explain terms, and help you analyze stocks.
              </p>
            </div>
          </div>
        </section>

        {/* How to Buy Stocks */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <FiDollarSign className="mr-2 text-purple-600" />
            How to Purchase Stocks
          </h3>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800">1. Research</h4>
              <p className="text-gray-700 text-sm mt-1">
                Use our research tools to analyze stocks. Look at historical performance, company fundamentals, and market trends.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800">2. Place an Order</h4>
              <p className="text-gray-700 text-sm mt-1">
                Click the "Trade" button on any stock. Choose between market orders (buy at current price) or limit orders (set your price).
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800">3. Monitor Your Portfolio</h4>
              <p className="text-gray-700 text-sm mt-1">
                Track your investments in the portfolio section. Set up alerts for price changes and important news.
              </p>
            </div>
          </div>
        </section>

        {/* Investment Strategies */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Investment Strategies</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800">Dollar-Cost Averaging</h4>
              <p className="text-gray-700 text-sm mt-1">
                Invest a fixed amount regularly regardless of the stock price. This reduces the impact of market volatility.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800">Long-Term Holding</h4>
              <p className="text-gray-700 text-sm mt-1">
                Buy and hold quality stocks for extended periods to benefit from compound growth and reduce trading costs.
              </p>
            </div>
          </div>
        </section>

        {/* Risk Management */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Risk Management</h3>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <span className="font-medium">Remember:</span> All investments carry risk. Never invest money you can't afford to lose. 
              Diversify your portfolio to spread risk across different sectors and asset classes.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EducationalResources;
