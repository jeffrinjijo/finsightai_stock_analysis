import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiRefreshCw } from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useFMPStocks } from '../hooks/useFMPStocks';

// Default stocks to show
const defaultStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "META", name: "Meta" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "JPM", name: "JPMorgan" },
  { symbol: "V", name: "Visa" },
  { symbol: "NFLX", name: "Netflix" }
];

function Simulate() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get stock symbols from default stocks
  const stockSymbols = useMemo(() => defaultStocks.map(stock => stock.symbol), []);
  
  // Use the useFMPStocks hook to manage stock data
  const { 
    stocks: allStocks, 
    loading, 
    error: stocksError, 
    refreshStock,
    hasData: hasStocksData
  } = useFMPStocks(stockSymbols);
  
  // Calculate average profit
  const avgProfit = useMemo(() => {
    if (history.length === 0) return 0;
    const total = history.reduce((sum, item) => sum + item.profit, 0);
    return (total / history.length).toFixed(2);
  }, [history]);
  
  // Get chart data for selected stock
  const chartData = useMemo(() => {
    if (!selectedStock) return [];
    const stock = allStocks.find(s => s.symbol === selectedStock.symbol);
    if (!stock || !stock.historicalData) return [];
    
    return stock.historicalData.map(item => ({
      date: item.date,
      price: item.close || item.price,
      volume: item.volume,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close || item.price
    }));
  }, [selectedStock, allStocks]);
  
  // Get current price data for selected stock
  const currentPriceData = useMemo(() => {
    if (!selectedStock) return null;
    const stock = allStocks.find(s => s.symbol === selectedStock.symbol);
    if (!stock) return null;
    
    return {
      price: stock.currentPrice || 0,
      changePercent: stock.changePercent || 0,
      change: stock.change || 0,
    };
  }, [selectedStock, allStocks]);
  
  // Handle stock refresh
  const handleRefresh = useCallback(async () => {
    if (!selectedStock) return;
    try {
      await refreshStock(selectedStock.symbol);
    } catch (err) {
      console.error('Error refreshing stock data:', err);
    }
  }, [selectedStock, refreshStock]);
  
  // Set initial selected stock when data loads
  useEffect(() => {
    if (allStocks.length > 0 && !selectedStock) {
      setSelectedStock({
        symbol: allStocks[0].symbol,
        name: allStocks[0].name
      });
    }
  }, [allStocks, selectedStock]);
  
  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return allStocks.map(stock => ({
      symbol: stock.symbol,
      name: stock.name
    }));
    
    const query = searchQuery.toLowerCase();
    return allStocks
      .filter(stock => 
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
      )
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name
      }));
  }, [searchQuery, allStocks]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("finsightSimulationHistory")) || [];
    setHistory(savedHistory);
  }, []);

  // Handle simulation
  const handleSimulate = () => {
    if (!selectedStock || !amount) {
      setError("Please select a stock and enter an amount");
      return;
    }
    
    const dailyChange = currentPriceData.changePercent;
    const investment = parseFloat(amount);
    const profit = (investment * dailyChange) / 100;
    
    const simulationResult = {
      id: Date.now(),
      symbol: selectedStock.symbol,
      amount: investment,
      profit,
      date: new Date().toISOString(),
      price: currentPriceData.price,
      changePercent: dailyChange
    };
    
    const newHistory = [simulationResult, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem("finsightSimulationHistory", JSON.stringify(newHistory));
    setResult(simulationResult);
  };

  // Clear simulation history
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all simulation history?")) {
      localStorage.removeItem("finsightSimulationHistory");
      setHistory([]);
      setResult(null);
    }
  };

  // Calculate simulation statistics
  const simulationStats = useMemo(() => {
    const stats = {
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0
    };

    if (history.length > 0) {
      stats.winningTrades = history.filter(item => item.profit >= 0).length;
      stats.losingTrades = history.length - stats.winningTrades;
      stats.winRate = (stats.winningTrades / history.length) * 100;
    }

    return stats;
  }, [history]);

  const totalSimulations = history.length;
  const netProfit = history.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Stock Simulation
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Simulate stock investments and track potential returns
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Stock Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-lg mb-4">
                Stock Selection
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search Stock
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by symbol or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-3 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto pr-1 -mr-1 mt-2">
                    {filteredStocks.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => setSelectedStock(stock)}
                        className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                          selectedStock?.symbol === stock.symbol
                            ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                        }`}
                        disabled={loading}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {stock.name}
                            </div>
                          </div>
                          {allStocks[stock.symbol]?.currentPrice && (
                            <div className="text-right">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(allStocks[stock.symbol].currentPrice)}
                              </div>
                              <div className={`text-xs ${
                                allStocks[stock.symbol].changePercent >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {allStocks[stock.symbol].changePercent >= 0 ? '+' : ''}
                                {allStocks[stock.symbol].changePercent?.toFixed(2) || '0.00'}%
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedStock && currentPriceData && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedStock.symbol}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedStock.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(currentPriceData.price)}
                        </div>
                        <div className={`text-sm flex items-center justify-end ${
                          currentPriceData.changePercent >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {currentPriceData.changePercent >= 0 ? (
                            <FiTrendingUp className="mr-1" />
                          ) : (
                            <FiTrendingDown className="mr-1" />
                          )}
                          {Math.abs(currentPriceData.changePercent).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Investment Amount ($)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="block w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                        disabled={!selectedStock || loading}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSimulate}
                    disabled={!selectedStock || !amount || loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                      !selectedStock || !amount || loading
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Simulating...' : 'Run Simulation'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-lg mb-4">Simulation Stats</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Simulations</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{history.length}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Net Profit/Loss</p>
                    <p className={`text-xl font-bold ${
                      netProfit >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(netProfit)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

              {/* Simulation History */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Simulation History</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {Math.min(history.length, 5)} of {history.length}
                    </span>
                  </div>
                  
                  {history.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Stock
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              P/L
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {history.slice(0, 5).map((sim, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="font-medium">{sim.symbol}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{sim.name}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right">
                                {formatCurrency(sim.amount)}
                              </td>
                              <td className={`px-4 py-3 whitespace-nowrap text-right ${
                                sim.profit >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {sim.profit >= 0 ? '+' : ''}{formatCurrency(sim.profit)}
                                <span className="text-xs ml-1">
                                  ({sim.change >= 0 ? '+' : ''}{sim.change.toFixed(2)}%)
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                {new Date(sim.date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No simulation history yet. Run a simulation to see results here.</p>
                    </div>
                  )}
                </div>
                
                {history.length > 5 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-700/50 text-right">
                    <button 
                      onClick={() => navigate('/history')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View All History →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      
      <div className="mt-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">30-Day Price Trend</h3>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  width={100}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={false}
                  name="Price"
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No price data available
            </div>
          )}
        </div>

        {result && (
          <div className="mt-6 text-center">
            <p className="text-gray-700">📊 Invested: ₹{result.amount}</p>
            <p className={`text-lg font-bold ${result.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {result.profit >= 0 ? "Profit" : "Loss"}: ₹{result.profit}
            </p>
            <p className="text-gray-700">
              Total Value: ₹{(result.amount + result.profit).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Simulation History + Insights */}
      {history.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow w-full max-w-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">🕓 Simulation History</h3>
            <button
              onClick={handleClearHistory}
              className="text-sm text-red-500 underline"
            >
              Clear All
            </button>
          </div>

          {/* Insight Summary */}
          <div className="mb-4 bg-blue-50 p-4 rounded-xl text-sm text-blue-900">
            <p><strong>Total Simulations:</strong> {totalSimulations}</p>
            <p><strong>Average Profit/Loss:</strong> ₹{avgProfit}</p>
            <p>
              <strong>Net Result:</strong>{" "}
              <span className={netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                ₹{netProfit.toFixed(2)}
              </span>
            </p>
          </div>

          <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
            {history.map((entry, index) => (
              <li key={index} className="border-b pb-2">
                <p>
                  <strong>{entry.stock}</strong> ({entry.change > 0 ? "+" : ""}{entry.change}%)
                  — ₹{entry.amount} ➜ {entry.profit >= 0 ? "+" : ""}₹{entry.profit}
                </p>
                <p className="text-gray-500">{entry.date}</p>
              </li>
            ))}
          </ul>

          {/* Profit Trend Chart */}
          {history.length >= 2 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Profit Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={history
                    .map((item, index) => ({
                      id: index + 1,
                      profit: item.profit,
                      label: new Date(item.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      }),
                    }))
                    .reverse()}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Simulate;
