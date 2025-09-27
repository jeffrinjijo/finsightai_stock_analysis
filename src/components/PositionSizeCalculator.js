import React, { useState } from 'react';
import { FiDollarSign, FiPercent, FiBarChart2 } from 'react-icons/fi';

const PositionSizeCalculator = () => {
  const [formData, setFormData] = useState({
    accountSize: 10000,
    riskPercentage: 1,
    entryPrice: '',
    stopLossPrice: '',
    positionSize: 0,
    riskAmount: 0,
    riskPerShare: 0
  });

  const calculatePositionSize = (e) => {
    e.preventDefault();
    const { accountSize, riskPercentage, entryPrice, stopLossPrice } = formData;
    
    if (!entryPrice || !stopLossPrice) return;
    
    const riskPerShare = Math.abs(parseFloat(entryPrice) - parseFloat(stopLossPrice));
    const riskAmount = (parseFloat(accountSize) * parseFloat(riskPercentage)) / 100;
    const positionSize = Math.floor(riskAmount / riskPerShare);
    
    setFormData(prev => ({
      ...prev,
      riskPerShare: parseFloat(riskPerShare.toFixed(2)),
      riskAmount: parseFloat(riskAmount.toFixed(2)),
      positionSize
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <FiDollarSign className="h-5 w-5 text-indigo-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Position Size Calculator</h3>
      </div>
      
      <form onSubmit={calculatePositionSize} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account Size ($)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="accountSize"
              value={formData.accountSize}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Risk Per Trade (%)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPercent className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="riskPercentage"
              value={formData.riskPercentage}
              onChange={handleInputChange}
              step="0.1"
              min="0.1"
              max="100"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Entry Price ($)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0.01"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stop Loss ($)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="stopLossPrice"
                value={formData.stopLossPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0.01"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate Position Size
        </button>
      </form>

      {(formData.positionSize > 0 || formData.riskAmount > 0) && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <p className="text-xs text-gray-500 dark:text-gray-400">Position Size</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formData.positionSize} shares
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <p className="text-xs text-gray-500 dark:text-gray-400">Risk Amount</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formData.riskAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <p className="text-xs text-gray-500 dark:text-gray-400">Risk Per Share</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formData.riskPerShare.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <p className="text-xs text-gray-500 dark:text-gray-400">Position Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${(formData.positionSize * parseFloat(formData.entryPrice || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionSizeCalculator;
