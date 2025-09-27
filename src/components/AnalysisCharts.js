import React, { useState, useEffect, useMemo } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import StockSelector from './StockSelector';
import { 
  FiFilter, 
  FiX, 
  FiSearch, 
  FiChevronDown, 
  FiChevronUp, 
  FiRefreshCw, 
  FiBarChart2 
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import StockAnalysis from './StockAnalysis';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

// Helper function to generate sample data
const generateSampleData = (count, min, max) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

// Sample data for the charts
const sampleData = {
  dates: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  }),
  values: generateSampleData(30, 1000, 5000),
  sectors: [
    { name: 'Technology', value: 35, color: '#4F46E5' },
    { name: 'Healthcare', value: 25, color: '#10B981' },
    { name: 'Finance', value: 20, color: '#3B82F6' },
    { name: 'Consumer', value: 10, color: '#F59E0B' },
    { name: 'Energy', value: 5, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ],
  assets: [
    { name: 'Stocks', value: 60, color: '#4F46E5' },
    { name: 'ETFs', value: 20, color: '#10B981' },
    { name: 'Bonds', value: 10, color: '#3B82F6' },
    { name: 'Crypto', value: 5, color: '#F59E0B' },
    { name: 'Cash', value: 5, color: '#6B7280' },
  ]
};

const AnalysisCharts = () => {
  const [analysisData, setAnalysisData] = useState({
    sector_allocation: {
      labels: [],
      data: [],
      colors: []
    },
    asset_allocation: {
      labels: [],
      data: [],
      colors: []
    },
    performance_metrics: {},
    historical_returns: {
      dates: [],
      cumulative_returns: []
    },
    stocks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('1y');
  const [showStockSelector, setShowStockSelector] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [analyzedStocks, setAnalyzedStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectors, setSelectedSectors] = useState(new Set());

  // Initialize with sample data
  useEffect(() => {
    setAnalysisData({
      sector_allocation: {
        labels: sampleData.sectors.map(s => s.name),
        data: sampleData.sectors.map(s => s.value),
        colors: sampleData.sectors.map(s => s.color)
      },
      asset_allocation: {
        labels: sampleData.assets.map(a => a.name),
        data: sampleData.assets.map(a => a.value),
        colors: sampleData.assets.map(a => a.color)
      },
      performance_metrics: {
        total_return: 12.5,
        volatility: 8.2,
        sharpe_ratio: 1.52,
        max_drawdown: -5.8
      },
      historical_returns: {
        dates: sampleData.dates,
        cumulative_returns: sampleData.values
      },
      stocks: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.34, sector: 'Technology', change: 1.23, changePercent: 0.71 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 312.45, sector: 'Technology', change: -0.85, changePercent: -0.27 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.19, sector: 'Consumer', change: 2.31, changePercent: 1.26 },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.76, sector: 'Finance', change: -1.45, changePercent: -0.72 },
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 157.83, sector: 'Healthcare', change: 0.67, changePercent: 0.43 }
      ]
    });
    setLoading(false);
  }, []);

  const filteredStocks = analysisData?.stocks?.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSectors.size === 0 || selectedSectors.has(stock.sector);
    return matchesSearch && matchesSector;
  });

  const toggleSector = (sector) => {
    const newSelectedSectors = new Set(selectedSectors);
    if (newSelectedSectors.has(sector)) {
      newSelectedSectors.delete(sector);
    } else {
      newSelectedSectors.add(sector);
    }
    setSelectedSectors(newSelectedSectors);
  };

  const toggleStockSelection = (symbol) => {
    const newSelectedStocks = new Set(selectedStocks);
    if (newSelectedStocks.has(symbol)) {
      newSelectedStocks.delete(symbol);
    } else {
      newSelectedStocks.add(symbol);
    }
    setSelectedStocks(Array.from(newSelectedStocks));
  };

  const handleStockSelection = (stocks) => {
    setSelectedStocks(stocks);
    if (analysisData?.stocks) {
      const stocksToAnalyze = analysisData.stocks.filter(stock => 
        stocks.includes(stock.symbol)
      );
      setAnalyzedStocks(stocksToAnalyze);
    }
    setShowStockSelector(false);
  };

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
          }
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
          weight: 'normal',
        },
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              }).format(context.parsed.y);
            }
            return label;
          },
          labelColor: function(context) {
            return {
              borderColor: context.dataset.borderColor || context.dataset.backgroundColor,
              backgroundColor: context.dataset.borderColor || context.dataset.backgroundColor,
              borderWidth: 2,
              borderRadius: 2,
            };
          },
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          },
          font: {
            size: 11,
          },
          padding: 8,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.03)',
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
          font: {
            size: 11,
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
        hitRadius: 10,
        hoverBorderWidth: 2,
      },
      line: {
        borderWidth: 2,
        tension: 0.3,
      },
    },
    animation: {
      duration: 1000,
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  }), [timeFrame]);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    cutout: '70%',
  }), []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }

  const { sector_allocation, asset_allocation, performance_metrics, historical_returns } = analysisData;

  // Performance Chart Data
  const performanceData = {
    labels: historical_returns.dates,
    datasets: [
      {
        label: 'Portfolio Value',
        data: historical_returns.cumulative_returns,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4F46E5',
        fill: true,
        tension: 0.3,
        yAxisID: 'y',
      },
    ],
  };

  // Add selected stocks to the chart
  if (analyzedStocks.length > 0) {
    const stockColors = [
      '#10B981', // Green
      '#3B82F6', // Blue
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
    ];
    
    analyzedStocks.forEach((stock, index) => {
      const basePrice = stock.price || 100;
      const priceData = historical_returns.dates.map((_, i) => {
        const variation = Math.sin(i / 3) * (basePrice * 0.1) * (1 + index * 0.2);
        return basePrice + variation;
      });
      
      performanceData.datasets.push({
        label: `${stock.symbol} Price`,
        data: priceData,
        borderColor: stockColors[index % stockColors.length],
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [0, 0],
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: stockColors[index % stockColors.length],
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: stockColors[index % stockColors.length],
        tension: 0.3,
        yAxisID: 'y',
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* Stock Analysis Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Stock Analysis</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowStockSelector(!showStockSelector)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiFilter className="mr-2 h-4 w-4" />
              {selectedStocks.length > 0 ? `${selectedStocks.length} Selected` : 'Select Stocks'}
            </button>
            {selectedStocks.length > 0 && (
              <button
                onClick={() => {
                  const updatedStocks = analysisData?.stocks?.filter(stock => 
                    selectedStocks.includes(stock.symbol)
                  ) || [];
                  setAnalyzedStocks(updatedStocks);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                title="Refresh analysis"
              >
                <FiRefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {showStockSelector && (
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <StockSelector 
              stocks={analysisData?.stocks || []} 
              onSelectStocks={handleStockSelection}
              onClose={() => setShowStockSelector(false)}
            />
          </div>
        )}

        {analyzedStocks.length > 0 ? (
          <div className="mt-6">
            <StockAnalysis 
              stocks={analyzedStocks.map(stock => ({
                ...stock,
                symbol: stock.symbol,
                name: stock.name,
                price: stock.price,
                change: stock.change,
                changePercent: stock.changePercent,
                sector: stock.sector,
                volume: stock.volume || 0,
                marketCap: stock.marketCap || 0,
                peRatio: stock.peRatio || 0,
                dividendYield: stock.dividendYield || 0,
                historicalData: stock.historicalData || []
              }))}
              title=""
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <FiBarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No stocks selected</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Click the "Select Stocks" button to add stocks for analysis.
            </p>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(performance_metrics).map(([key, value]) => (
          <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
              {key.split('_').join(' ')}
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {typeof value === 'number' ? `${value > 0 ? '+' : ''}${value}%` : value}
            </p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Portfolio Performance</h2>
          <div className="flex space-x-2">
            {['1m', '3m', '6m', '1y', 'All'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeFrame(period.toLowerCase())}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeFrame === period.toLowerCase()
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <Line data={performanceData} options={chartOptions} />
        </div>
      </div>

      {/* Allocation Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sector Allocation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sector Allocation</h2>
          <div className="h-64">
            <Doughnut
              data={{
                labels: sector_allocation.labels,
                datasets: [
                  {
                    data: sector_allocation.data,
                    backgroundColor: sector_allocation.colors,
                    borderWidth: 0,
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Asset Allocation</h2>
          <div className="h-64">
            <Doughnut
              data={{
                labels: asset_allocation.labels,
                datasets: [
                  {
                    data: asset_allocation.data,
                    backgroundColor: asset_allocation.colors,
                    borderWidth: 0,
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;