import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fetchStockData } from "../utils/api.jsxundefined;
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPercent, FiBarChart2, FiActivity } from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Helper function to process stock data
const processStockData = (timeSeries) => {
  if (!timeSeries || !timeSeries['Time Series (Daily)']) return [];
  
  const dailyData = timeSeries['Time Series (Daily)'];
  const dates = Object.keys(dailyData).slice(0, 30).reverse(); // Last 30 days
  
  return dates.map((date, index) => {
    const dayData = dailyData[date];
    const close = parseFloat(dayData['4. close']);
    const open = parseFloat(dayData['1. open']);
    const high = parseFloat(dayData['2. high']);
    const low = parseFloat(dayData['3. low']);
    const volume = parseFloat(dayData['5. volume']);
    const change = ((close - open) / open) * 100;
    
    return {
      date,
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      close,
      open,
      high,
      low,
      volume,
      change,
      // Calculate a simple moving average (5-day)
      sma: index >= 4 ? 
        dates.slice(Math.max(0, index - 4), index + 1)
          .reduce((sum, d) => sum + parseFloat(dailyData[d]['4. close']), 0) / 
          Math.min(5, index + 1) : null
    };
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.change >= 0;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{data.date}</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Price:</span>
            <span className="font-medium">${data.close.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Change:</span>
            <span className={`flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              {data.change.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">High:</span>
            <span>${data.high.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Low:</span>
            <span>${data.low.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Volume:</span>
            <span>{(data.volume / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const MetricCard = ({ icon: Icon, title, value, change, isCurrency = false, isPercentage = false }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {isCurrency ? '$' : ''}{value}{isPercentage ? '%' : ''}
          </p>
        </div>
        <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          <Icon className={`w-5 h-5 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
        </div>
      </div>
      {change !== undefined && (
        <div className={`mt-2 text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}% from open
        </div>
      )}
    </div>
  );
};

export default function ChartsSection({ symbol = 'AAPL' }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartData = useMemo(() => {
    if (!stockData) return [];
    return processStockData(stockData.timeSeries);
  }, [stockData]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const latest = chartData[chartData.length - 1];
    const previousDay = chartData[chartData.length - 2] || latest;
    const weekAgo = chartData[Math.max(0, chartData.length - 5)] || latest;
    
    const dayChange = ((latest.close - latest.open) / latest.open) * 100;
    const weekChange = ((latest.close - weekAgo.close) / weekAgo.close) * 100;
    const volumeChange = ((latest.volume - previousDay.volume) / previousDay.volume) * 100;
    
    return {
      price: latest.close,
      dayChange,
      weekChange,
      volume: latest.volume,
      volumeChange,
      high: latest.high,
      low: latest.low,
      range: ((latest.high - latest.low) / latest.low) * 100
    };
  }, [chartData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchStockData(symbol);
        setStockData(data);
      } catch (err) {
        console.error(`Error fetching data for ${symbol}:`, err);
        setError(`Failed to load data for ${symbol}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !stockData || chartData.length === 0) {
    return (
      <div className="text-center py-12 text-red-500 dark:text-red-400">
        {error || 'No data available'}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={FiDollarSign}
          title="Current Price"
          value={metrics.price.toFixed(2)}
          change={metrics.dayChange}
          isCurrency
        />
        <MetricCard 
          icon={FiPercent}
          title="Day Change"
          value={metrics.dayChange.toFixed(2)}
          change={metrics.dayChange}
          isPercentage
        />
        <MetricCard 
          icon={FiBarChart2}
          title="Week Change"
          value={metrics.weekChange.toFixed(2)}
          change={metrics.weekChange}
          isPercentage
        />
        <MetricCard 
          icon={FiActivity}
          title="Daily Range"
          value={metrics.range.toFixed(2)}
          change={0}
          isPercentage
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Movement</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="close"
                  isAnimationActive={false}
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#4F46E5' }}
                  name="Price"
                />
                <Line
                  type="monotone"
                  dataKey="sma"
                  isAnimationActive={false}
                  stroke="#F59E0B"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="3 3"
                  name="5-Day SMA"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trading Volume</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="volume" 
                  fill="#8B5CF6" 
                  name="Volume"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <rect
                      key={`bar-${index}`}
                      x={entry.name}
                      width="100%"
                      height="100%"
                      fill={entry.change >= 0 ? '#10B981' : '#EF4444'}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
