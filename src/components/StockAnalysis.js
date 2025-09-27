import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FiHome, FiTrendingUp, FiPieChart, FiDollarSign, FiBarChart2, FiActivity, FiSettings, FiBell,
  FiSearch, FiPlus, FiChevronDown, FiStar, FiRefreshCw, FiFilter, FiGrid, FiList,
  FiArrowUpRight, FiArrowDownRight, FiInfo, FiShare2, FiExternalLink, FiDroplet
} from "react-icons/fi";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler, TimeScale, ArcElement
} from "chart.js";
import "chartjs-adapter-date-fns";
import { faker } from "@faker-js/faker";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler, TimeScale
);

// Utility functions
const formatCurrency = (value, symbol='$') => {
  if (value === undefined || value === null) return 'N/A';
  return `${symbol}${value.toFixed(2)}`;
};
const formatNumber = (num) => {
  if (num === undefined || num === null) return 'N/A';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toString();
};
const formatPercent = (value) => {
  if (value === undefined || value === null) return "0.00%";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};
const generateChartData = (price, isPositive) => {
  const baseData = Array.from({ length: 20 }, (_, i) => {
    const baseValue = price + (Math.sin(i) * (price * 0.02));
    const noise = (Math.random() - 0.5) * (price * 0.01);
    return baseValue + noise;
  });
  return {
    labels: baseData.map((_, i) => `Day ${i+1}`),
    datasets: [{
      label: "Price",
      data: baseData,
      borderColor: isPositive ? "#10B981" : "#EF4444",
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0,0,0,200);
        gradient.addColorStop(0, isPositive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)");
        gradient.addColorStop(1, isPositive ? "rgba(16,185,129,0.01)" : "rgba(239,68,68,0.01)");
        return gradient;
      },
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: isPositive ? "#10B981" : "#EF4444",
    }]
  };
};
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "rgba(17,24,39,0.95)",
      titleFont: { size: 12, weight: "600" },
      bodyFont: { size: 12, weight: "500" },
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (context) => `Price: $${context.parsed.y.toFixed(2)}`
      }
    }
  },
  scales: { y: { display: false, beginAtZero: false }, x: { display: false } },
  elements: { point: { radius: 0, hoverRadius: 5, hoverBorderWidth: 2 }, line: { borderWidth: 2, tension: 0.4 } },
  interaction: { mode: "nearest", axis: "x", intersect: false },
  animation: { duration: 1000, easing: "easeInOutQuart" },
  layout: { padding: { top: 10, bottom: 10, left: 10, right: 10 } }
};

// UI components
const StockCardSkeleton = () => (
  <div className="bg-white/80 dark:bg-gray-800/80 ...">
    <div className="animate-pulse space-y-4">
      {/* ...skeleton loading ... */}
    </div>
  </div>
);

const MetricCard = ({title, value, icon: Icon, change, isPositive, isLoading, className=""}) => (
  <motion.div className={`bg-white/70 dark:bg-gray-800/70 ... ${className}`}
    whileHover={{y: -3, boxShadow:"0 10px 25px -5px rgba(0,0,0,0.1)"}}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      {Icon && <Icon className="h-5 w-5 text-gray-400"/>}
    </div>
    {isLoading ? (
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
    ) : (
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        {change && (
          <span className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${isPositive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
            {isPositive ? <FiArrowUpRight className="h-3.5 w-3.5 mr-0.5"/> : <FiArrowDownRight className="h-3.5 w-3.5 mr-0.5"/>}
            {change}
          </span>
        )}
      </div>
    )}
  </motion.div>
);

const SectorPerformanceCard = ({ sectors, isLoading }) => {
  const [selectedSector, setSelectedSector] = useState(sectors[0]?.sector || "");
  return (
    <motion.div className="bg-white/70 dark:bg-gray-800/70 ...">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sector Performance</h3>
        <select
          className="..."
          value={selectedSector}
          onChange={e => setSelectedSector(e.target.value)}
        >
          {sectors.map(sector =>
            <option key={sector.sector} value={sector.sector}>{sector.sector}</option>
          )}
        </select>
      </div>
      <div className="h-48">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between">
            {sectors.find(s => s.sector === selectedSector)?.stocks?.map(stock => (
              <div key={stock.symbol} className="mb-2">
                {/* ...Sector Performance ... */}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const NewsCard = ({title, description, source, date, imageUrl, isLoading}) => {
  if(isLoading) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 ...">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="p-5"> ... </div>
      </div>
    );
  }
  return (
    <motion.div className="bg-white/70 dark:bg-gray-800/70 ... flex flex-col">
      {imageUrl && (
        <div className="h-40 overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover ..."/>
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">{description}</p>
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">{source}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(date).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

const StockAnalysisCard = ({stock, onRefresh, isLoading}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if(isHovered) {
      controls.start({scale: 1.02, boxShadow:"0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"});
    } else {
      controls.start({scale: 1, boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"});
    }
  }, [isHovered, controls]);
  // Calculate values that don't depend on stock being defined
  const priceChange = stock?.change || 0;
  const changePercent = stock?.changePercent || 0;
  const isPositive = priceChange >= 0;
  
  // Move useMemo before any conditional returns
  const chartData = useMemo(() =>
    generateChartData(stock?.price || 0, isPositive), 
    [stock?.price, isPositive]
  );
  
  const sectorColors = {/* ...as above ... */};
  
  // Move the conditional return after all hooks
  if (!stock) return <StockCardSkeleton/>;
  const sectorData = sectorColors[stock.sector] || sectorColors.default;

  return (
    <motion.div
      className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 ..."
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* ... Stock Card content ... */}
    </motion.div>
  );
};

const Sidebar = () => (
  <div className="w-64 bg-white dark:bg-gray-900 ...">
    {/* ... sidebar contents ... */}
  </div>
);

const StockCard = ({stock, onRefresh, isFavorite, onToggleFavorite, isLoading}) => {
  const isPositive = (stock.changePercent || 0) >= 0;
  return (
    <div className="bg-white dark:bg-gray-800 ...">
      {/* ... Stock card layout ... */}
    </div>
  );
}

// Main Stock Analysis Component
const StockAnalysis = ({stocks=[], title="Stock Analysis"}) => {
  // ... full hook and event logic as in [file:1]...
  // ... render grid/list, cards, news, & controls as described ...
  return (
    <div className="min-h-screen bg-gradient-to-br ... py-8 px-4 sm:px-6 lg:px-8">
      {/* All UI sections, metrics, filters, cards, news, etc. */}
    </div>
  );
};

export default StockAnalysis;
