import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiPercent, FiClock, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const TradingInterface = ({ symbol, price, onExecuteTrade }) => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('market');
  const [orderPrice, setOrderPrice] = useState(price || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (price) {
      setOrderPrice(price);
    }
  }, [price]);

  const handleSubmit = async (side) => {
    if (!symbol || quantity <= 0) return;
    
    setIsSubmitting(true);
    
    try {
      const order = {
        symbol,
        quantity: parseInt(quantity),
        side,
        type: orderType,
        price: orderType === 'limit' ? parseFloat(orderPrice) : null,
        timestamp: new Date().toISOString()
      };
      
      // Call the passed onExecuteTrade function
      await onExecuteTrade(order);
      
      // Show success state
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      
      // Reset form
      setQuantity(1);
    } catch (error) {
      console.error('Trade execution failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalValue = (quantity * orderPrice).toFixed(2);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {symbol || 'Select a stock'}
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Current Price</div>
          <div className="text-xl font-bold">
            {price ? `$${price.toFixed(2)}` : 'N/A'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order Type
          </label>
          <select
            id="orderType"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop" disabled>Stop Order</option>
            <option value="stop_limit" disabled>Stop Limit</option>
          </select>
        </div>

        {orderType === 'limit' && (
          <div>
            <label htmlFor="orderPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Limit Price ($)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="orderPrice"
                min="0.01"
                step="0.01"
                value={orderPrice}
                onChange={(e) => setOrderPrice(e.target.value)}
                className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="1"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">shares</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span>Estimated Value</span>
            <span className="font-medium">${totalValue}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Commission</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${totalValue}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => handleSubmit('buy')}
            disabled={!symbol || isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowUp className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Processing...' : 'Buy'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('sell')}
            disabled={!symbol || isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowDown className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Processing...' : 'Sell'}
          </button>
        </div>

        {isSuccess && (
          <div className="mt-3 p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900 dark:text-green-200 rounded-md">
            Order placed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingInterface;
