// Stock data from the Excel file
export const stockData = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 170.76,
    dayChange: 0.08,
    weekReturn: 5.2,
    monthReturn: 46.1,
    marketCap: 4100,
    peRatio: 50.5,
    dividendYield: 0.02,
    sector: "Technology"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 498.41,
    dayChange: -0.013,
    weekReturn: 3.8,
    monthReturn: 20.3,
    marketCap: 3720,
    peRatio: 36.4,
    dividendYield: 0.7,
    sector: "Technology"
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 234.35,
    dayChange: 2.0,
    weekReturn: 4.7,
    monthReturn: 6.5,
    marketCap: 3365,
    peRatio: 35.0,
    dividendYield: 0.4,
    sector: "Technology"
  }
];

// Generate historical data for the last 30 days
export const generateHistoricalData = (symbol, basePrice, volatility = 0.02) => {
  const today = new Date();
  const historicalData = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate some random price movement based on volatility
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
    const price = i === 30 ? basePrice : historicalData[historicalData.length - 1].close * randomFactor;
    
    // Generate OHLC data
    const open = price * (0.99 + Math.random() * 0.02);
    const high = Math.max(open, price * (1 + Math.random() * 0.01));
    const low = Math.min(open, price * (0.99 - Math.random() * 0.01));
    const close = price;
    
    historicalData.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(1000000 + Math.random() * 9000000) // Random volume between 1M and 10M
    });
  }
  
  return historicalData;
};

// Add historical data to each stock
stockData.forEach(stock => {
  stock.historicalData = generateHistoricalData(stock.symbol, stock.price);
});

export default stockData;
