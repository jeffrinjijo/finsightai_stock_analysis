// This file is used to log environment variables at runtime
// to help debug environment variable loading issues

console.log('Environment Variables in setupEnv.js:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_USE_PROXY: process.env.REACT_APP_USE_PROXY,
  REACT_APP_ALPHA_VANTAGE_API_KEY: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY ? '***' + process.env.REACT_APP_ALPHA_VANTAGE_API_KEY.slice(-4) : 'undefined',
  REACT_APP_FMP_API_KEY: process.env.REACT_APP_FMP_API_KEY ? '***' + process.env.REACT_APP_FMP_API_KEY.slice(-4) : 'undefined',
  PUBLIC_URL: process.env.PUBLIC_URL
});

// Export the environment variables for use in other files
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_USE_PROXY: process.env.REACT_APP_USE_PROXY,
  REACT_APP_ALPHA_VANTAGE_API_KEY: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY,
  REACT_APP_FMP_API_KEY: process.env.REACT_APP_FMP_API_KEY,
  PUBLIC_URL: process.env.PUBLIC_URL
};
