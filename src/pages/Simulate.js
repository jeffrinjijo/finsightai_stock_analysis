import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiRefreshCw, FiSearch, FiBarChart2, FiArrowUp, FiArrowDown } from "react-icons/fi";
import stockData from "../data/stockData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
  Cell,
  PieChart,
  Pie,
  Sector
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  InputAdornment, 
  CircularProgress,
  FormControl,
  InputLabel,
  Slider,
  Tab,
  Tabs,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)'
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '8px',
  fontWeight: 600,
  padding: '10px 20px',
  boxShadow: '0 2px 10px 0 rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
  },
}));

// Use the imported stock data
const defaultStocks = stockData.map(stock => ({
  symbol: stock.symbol,
  name: stock.name,
  sector: stock.sector,
  price: stock.price,
  dayChange: stock.dayChange,
  weekReturn: stock.weekReturn,
  monthReturn: stock.monthReturn,
  marketCap: stock.marketCap,
  peRatio: stock.peRatio,
  dividendYield: stock.dividendYield,
  historicalData: stock.historicalData || Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: Math.round((stock.price * (1 + (Math.random() * 0.1 - 0.05))) * 100) / 100,
    volume: Math.floor(Math.random() * 10000) + 1000
  }))
}));

// Date formatter
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{formatDate(label)}</p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-300">Price: </span>
          <span className="font-medium">${payload[0].value.toFixed(2)}</span>
        </p>
        {payload[1] && (
          <p className="text-sm">
            <span className="text-gray-600 dark:text-gray-300">Volume: </span>
            <span className="font-medium">{payload[1].value.toLocaleString()}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

function Simulate() {
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState(defaultStocks[0]);
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [timePeriod, setTimePeriod] = useState(12);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter stocks based on search term
  const filteredStocks = useMemo(() => {
    if (!searchTerm) return defaultStocks;
    const term = searchTerm.toLowerCase();
    return defaultStocks.filter(stock => 
      stock.name.toLowerCase().includes(term) || 
      stock.symbol.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handle stock selection
  const handleStockSelect = (symbol) => {
    const stock = defaultStocks.find(s => s.symbol === symbol);
    if (stock) setSelectedStock(stock);
  };

  // Run simulation
  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate API call
    setTimeout(() => {
      const result = {
        initialInvestment: investmentAmount,
        finalValue: investmentAmount * (1 + (selectedStock.monthReturn / 100 * timePeriod)),
        profit: (investmentAmount * (selectedStock.monthReturn / 100 * timePeriod)),
        timePeriod,
        chartData: selectedStock.historicalData.map((data, i) => ({
          date: data.date,
          price: data.price,
          value: investmentAmount * (1 + (selectedStock.monthReturn / 100 * (i / selectedStock.historicalData.length * timePeriod)))
        }))
      };
      
      setSimulationResults(result);
      setIsSimulating(false);
    }, 1000);
  };

  // Calculate percentage change
  const calculateChange = (current, previous) => {
    return ((current - previous) / previous * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Stock Simulation
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Simulate stock investments and track potential returns
              </p>
            </div>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<FiRefreshCw />}
              onClick={() => window.location.reload()}
            >
              Reset
            </Button>
          </div>
          
          <Divider className="my-4" />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Left Column - Stock Selection and Controls */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6 h-full">
            {/* Stock Selection Card */}
            <StyledCard>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-semibold text-gray-800 dark:text-white">
                    Select Stock
                  </Typography>
                  <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search stocks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-80 overflow-y-auto p-2">
                  {filteredStocks.map((stock) => (
                    <div 
                      key={stock.symbol}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedStock?.symbol === stock.symbol 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}
                      onClick={() => handleStockSelect(stock.symbol)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{stock.symbol}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{stock.name}</p>
                        </div>
                        <Chip 
                          label={stock.sector} 
                          size="small" 
                          className="text-xs"
                          color="primary"
                          variant="outlined"
                        />
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${stock.price.toFixed(2)}
                        </span>
                        <span className={`text-sm font-medium ${stock.dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stock.dayChange >= 0 ? '+' : ''}{stock.dayChange}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <Divider className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Typography variant="subtitle2" className="mb-2 text-gray-700 dark:text-gray-300">
                        Investment Amount
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          inputProps: { min: 100, step: 100 }
                        }}
                      />
                      <Slider
                        value={investmentAmount}
                        onChange={(_, value) => setInvestmentAmount(value)}
                        min={100}
                        max={100000}
                        step={100}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Typography variant="subtitle2" className="mb-2 text-gray-700 dark:text-gray-300">
                        Time Period (Months)
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">months</InputAdornment>,
                          inputProps: { min: 1, max: 60 }
                        }}
                      />
                      <Slider
                        value={timePeriod}
                        onChange={(_, value) => setTimePeriod(value)}
                        min={1}
                        max={60}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value} mo`}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={runSimulation}
                      disabled={isSimulating || !selectedStock}
                      startIcon={isSimulating ? <CircularProgress size={20} color="inherit" /> : <FiBarChart2 />}
                    >
                      {isSimulating ? 'Simulating...' : 'Run Simulation'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </StyledCard>
            
            {/* Simulation Results */}
            {simulationResults && (
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-4 text-gray-800 dark:text-white">
                    Simulation Results
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <Typography variant="subtitle2" className="text-blue-700 dark:text-blue-300">
                        Initial Investment
                      </Typography>
                      <Typography variant="h5" className="font-bold text-blue-900 dark:text-white">
                        {formatCurrency(simulationResults.initialInvestment)}
                      </Typography>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <Typography variant="subtitle2" className="text-green-700 dark:text-green-300">
                        Final Value
                      </Typography>
                      <Typography variant="h5" className="font-bold text-green-900 dark:text-white">
                        {formatCurrency(simulationResults.finalValue)}
                      </Typography>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${simulationResults.profit >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <Typography variant="subtitle2" className={simulationResults.profit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                        {simulationResults.profit >= 0 ? 'Profit' : 'Loss'}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        className={`font-bold ${simulationResults.profit >= 0 ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}
                      >
                        {simulationResults.profit >= 0 ? '+' : ''}{formatCurrency(simulationResults.profit)} 
                        <span className="text-sm ml-2">
                          ({calculateChange(simulationResults.finalValue, simulationResults.initialInvestment)}%)
                        </span>
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simulationResults.chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          name="Portfolio Value" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <ReferenceLine y={simulationResults.initialInvestment} stroke="#10B981" strokeDasharray="3 3" />
                        <Brush dataKey="date" height={30} stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </StyledCard>
            )}
          </div>
          
          {/* Right Column - Charts and Info */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 h-full">
            {/* Selected Stock Info */}
            <StyledCard>
              <CardContent>
                {selectedStock ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                          {selectedStock.name} ({selectedStock.symbol})
                        </Typography>
                        <Chip 
                          label={selectedStock.sector} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                          className="mt-1"
                        />
                      </div>
                      <div className="text-right">
                        <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
                          ${selectedStock.price.toFixed(2)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          className={`font-medium ${selectedStock.dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                        >
                          {selectedStock.dayChange >= 0 ? '+' : ''}{selectedStock.dayChange}% today
                        </Typography>
                      </div>
                    </div>
                    
                    <Divider className="my-4" />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Market Cap</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(selectedStock.marketCap)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">P/E Ratio</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedStock.peRatio.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Dividend Yield</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedStock.dividendYield}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">52W High</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${(selectedStock.price * 1.15).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">52W Low</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${(selectedStock.price * 0.85).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <Typography>Select a stock to view details</Typography>
                )}
              </CardContent>
            </StyledCard>
            
            {/* Price Chart */}
            <StyledCard>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4 text-gray-800 dark:text-white">
                  Price History (30 Days)
                </Typography>
                {selectedStock ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedStock.historicalData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).getDate()}
                        />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          name="Price" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Select a stock to view price history
                  </div>
                )}
              </CardContent>
            </StyledCard>
            
            {/* Recent Transactions / News */}
            <StyledCard>
              <CardContent>
                <Tabs 
                  value={tabValue} 
                  onChange={(_, newValue) => setTabValue(newValue)}
                  variant="fullWidth"
                  className="mb-4"
                >
                  <Tab label="News" />
                  <Tab label="Transactions" />
                </Tabs>
                
                {tabValue === 0 ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                        <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                          {selectedStock?.name || 'Company'} announces Q{Math.ceil(Math.random() * 4)} {new Date().getFullYear()} results
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {Math.ceil(Math.random() * 24)} hours ago • {['Bloomberg', 'Reuters', 'CNBC'][Math.floor(Math.random() * 3)]}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => {
                      const isBuy = Math.random() > 0.5;
                      const amount = (Math.random() * 1000 + 100).toFixed(2);
                      const shares = (Math.random() * 10 + 1).toFixed(2);
                      const price = (amount / shares).toFixed(2);
                      
                      return (
                        <div key={item} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <div>
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${isBuy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="font-medium text-sm">{isBuy ? 'BUY' : 'SELL'}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isBuy ? '+' : '-'}${amount}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {shares} shares @ ${price}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </StyledCard>
          </div>
        </div>
        
        {/* Back to Dashboard Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/dashboard")}
            className="text-sm"
            startIcon={<FiDollarSign />}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Simulate;
