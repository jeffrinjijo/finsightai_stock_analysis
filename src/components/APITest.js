import React, { useState } from 'react';
import { getQuote } from '../api/stockApi';

const APITest = () => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const testAPI = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      console.log('Testing API with direct fetch...');
      
      // Test with direct fetch
      const testSymbol = 'AAPL';
      const url = `https://financialmodelingprep.com/api/v3/quote/${testSymbol}?apikey=${apiKey || 'demo'}`;
      
      console.log('API URL:', url);
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!result || result.length === 0) {
        throw new Error('No data returned from API');
      }
      
      setData(result[0]);
      setStatus('success');
      console.log('API Test Success:', result[0]);
      
    } catch (err) {
      console.error('API Test Failed:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">FMP API Connection Test</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            FMP API Key (or leave empty for demo mode):
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your FMP API key"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Using: {apiKey ? 'Your API key' : 'Demo mode (limited functionality)'}
          </p>
        </div>
        
        <div className="mb-4">
          <button
            onClick={testAPI}
            disabled={status === 'loading'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Testing...' : 'Test API Connection'}
          </button>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
          <h3 className="font-medium mb-2">API Status:</h3>
          <div className="font-mono text-sm">
            {status === 'idle' && <p>Click the button to test the API connection</p>}
            {status === 'loading' && <p>Testing connection to FMP API...</p>}
            {status === 'error' && (
              <div className="text-red-600 dark:text-red-400">
                <p className="font-bold">Error connecting to FMP API:</p>
                <p>{error}</p>
                <p className="mt-2">Please check:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Your internet connection</li>
                  <li>If the FMP API is currently available</li>
                  <li>Your API key is correct and has the required permissions</li>
                  <li>That you're not being blocked by CORS (try disabling any browser extensions)</li>
                </ul>
              </div>
            )}
            {status === 'success' && (
              <div className="text-green-600 dark:text-green-400">
                <p className="font-bold">Successfully connected to FMP API!</p>
                <pre className="mt-2 p-2 bg-black text-white rounded overflow-auto max-h-60">
                  {JSON.stringify(data, null, 2)}
                </pre>
                {!apiKey && (
                  <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                    <p className="font-bold">Note:</p>
                    <p>You're using the demo API key which has limited functionality.</p>
                    <p>For full access, please use your own FMP API key.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITest;
