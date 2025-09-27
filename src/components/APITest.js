import React, { useState } from 'react';

const StockLookup = () => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [symbol, setSymbol] = useState('AAPL');

  const fetchStock = async () => {
    setStatus('loading');
    setError(null);
    setData(null);

    try {
      const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey || 'demo'}`;
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`HTTP ${response.status} - ${errMsg}`);
      }

      if (!result || result.length === 0) {
        throw new Error('No data returned from API');
      }

      setData(result[0]);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Stock Lookup (FMP API)</h2>

        {/* API Key Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            FMP API Key:
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
            placeholder="Enter your FMP API key (leave empty for demo)"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Using: {apiKey ? 'Your API key' : 'Demo mode (limited)'}
          </p>
        </div>

        {/* Stock Symbol Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stock Symbol:
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
            placeholder="e.g., AAPL, TSLA, MSFT"
          />
        </div>

        {/* Fetch Button */}
        <div className="mb-4">
          <button
            onClick={fetchStock}
            disabled={status === 'loading'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {status === 'loading' && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {status === 'loading' ? 'Fetching...' : 'Get Stock Data'}
          </button>
        </div>

        {/* Status + Results */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
          {status === 'idle' && <p>Enter a stock symbol and click the button</p>}
          {status === 'loading' && <p>Fetching stock data...</p>}
          {status === 'error' && (
            <div className="text-red-600 dark:text-red-400">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          {status === 'success' && data && (
            <div className="text-green-700 dark:text-green-300">
              <h3 className="text-lg font-bold mb-2">{data.name} ({data.symbol})</h3>
              <p><strong>Price:</strong> ${data.price}</p>
              <p><strong>Change:</strong> {data.change} ({data.changesPercentage}%)</p>
              <p><strong>Day Low:</strong> ${data.dayLow} | <strong>Day High:</strong> ${data.dayHigh}</p>
              <p><strong>Year Low:</strong> ${data.yearLow} | <strong>Year High:</strong> ${data.yearHigh}</p>
              
              {/* Raw JSON for debugging */}
              <details className="mt-3">
                <summary className="cursor-pointer text-blue-600 dark:text-blue-400">View Raw JSON</summary>
                <pre className="mt-2 p-2 bg-black text-white rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockLookup;
