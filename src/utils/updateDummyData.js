const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Paths
const excelPath = path.join(__dirname, '../../../dummy_datas.xlsx');
const outputPath = path.join(__dirname, 'dummyData.js');

// Read and process Excel data
function processExcelData() {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to array of objects
    const stocks = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = stocks[0];
    const rows = stocks.slice(1);
    
    // Process into our format
    const stockData = rows.map(row => {
      const stock = {};
      headers.forEach((header, index) => {
        stock[header] = row[index];
      });
      return stock;
    });
    
    return stockData;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    return [];
  }
}

// Helper function to parse percentage strings
function parsePercentage(value) {
  if (typeof value === 'string') {
    return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
  }
  return value || 0;
}

// Generate the new dummy data file
function generateDummyData(stocks) {
  // Process stocks data
  const watchlist = stocks.map(stock => {
    // Parse the price, ensuring it's a number
    const price = typeof stock['Price (USD)'] === 'number' ? stock['Price (USD)'] : 
                 parseFloat(stock['Price (USD)'].toString().replace(/[^0-9.-]+/g, ''));
    
    // Parse the change percentage
    const changePercent = parsePercentage(stock['1D Change %']);
    
    return {
      symbol: stock.Symbol,
      name: stock.Company,
      price: price,
      change: changePercent,
      changePercent: changePercent,
      marketCap: `$${stock['Market Cap (USD B)']}B`,
      peRatio: stock['P/E Ratio'],
      dividendYield: stock['Dividend Yield %']
    };
  });

  // Calculate total market cap for portfolio distribution
  const totalMarketCap = stocks.reduce((sum, stock) => sum + (stock['Market Cap (USD B)'] || 0), 0);
  
  // Generate portfolio performance data based on actual stock data
  const portfolioPerformance = {
    currentValue: Math.round(totalMarketCap * 1000), // Convert to millions for demo
    totalReturn: 12.5,
    chartData: [
      { date: 'Jan', value: Math.round(totalMarketCap * 800) },
      { date: 'Feb', value: Math.round(totalMarketCap * 850) },
      { date: 'Mar', value: Math.round(totalMarketCap * 900) },
      { date: 'Apr', value: Math.round(totalMarketCap * 920) },
      { date: 'May', value: Math.round(totalMarketCap * 950) },
      { date: 'Jun', value: Math.round(totalMarketCap * 1000) },
      { date: 'Jul', value: Math.round(totalMarketCap * 1050) },
      { date: 'Aug', value: Math.round(totalMarketCap * 1100) },
      { date: 'Sep', value: Math.round(totalMarketCap * 1200) }
    ]
  };

  // Generate stock analysis data with exact values from Excel
  const stockAnalysis = {};
  stocks.forEach(stock => {
    const symbol = stock.Symbol;
    const price = typeof stock['Price (USD)'] === 'number' ? stock['Price (USD)'] : 
                 parseFloat(stock['Price (USD)'].toString().replace(/[^0-9.-]+/g, ''));
    const changePercent = parsePercentage(stock['1D Change %']);
    
    stockAnalysis[symbol] = {
      symbol,
      name: stock.Company,
      price: price,
      change: changePercent,
      changePercent: changePercent,
      marketCap: `$${stock['Market Cap (USD B)']}B`,
      peRatio: stock['P/E Ratio'],
      dividendYield: stock['Dividend Yield %'],
      oneWeekReturn: parsePercentage(stock['1W Return %']),
      oneMonthReturn: parsePercentage(stock['1M Return %']),
      sector: 'Technology',
      volume: Math.floor(price * 10000), // Volume based on price for realism
      avgVolume: Math.floor(price * 5000),
      high52Week: Math.round(price * 1.3 * 100) / 100, // 30% higher than current
      low52Week: Math.round(price * 0.8 * 100) / 100,  // 20% lower than current
      beta: (Math.random() * 2).toFixed(2)
    };
  });

  // Generate other dummy data
  const assetAllocation = [
    { name: 'Stocks', value: 75 },
    { name: 'Bonds', value: 15 },
    { name: 'Cash', value: 10 }
  ];

  const recentTransactions = [
    {
      id: 1,
      symbol: 'AAPL',
      type: 'BUY',
      shares: 5,
      price: 234.35,
      date: new Date().toISOString(),
      status: 'Completed'
    },
    {
      id: 2,
      symbol: 'MSFT',
      type: 'BUY',
      shares: 3,
      price: 498.41,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'Completed'
    }
  ];

  const marketOverview = {
    sp500: { value: 4500.12, change: 0.8 },
    nasdaq: { value: 15250.34, change: 1.2 },
    dow: { value: 34500.67, change: 0.5 },
    vix: { value: 16.5, change: -2.1 }
  };

  const newsUpdates = [
    {
      id: 1,
      title: 'Tech Stocks Rally as Market Shows Strong Recovery',
      source: 'Financial Times',
      date: new Date().toISOString(),
      summary: 'Technology stocks lead the market with significant gains this week.',
      url: '#',
      relatedStocks: ['AAPL', 'MSFT', 'GOOGL']
    },
    {
      id: 2,
      title: 'NVIDIA Announces New AI Chip',
      source: 'TechCrunch',
      date: new Date(Date.now() - 86400000).toISOString(),
      summary: 'NVIDIA unveils next-generation AI processor with 10x performance boost.',
      url: '#',
      relatedStocks: ['NVDA']
    }
  ];

  const financialGoals = [
    {
      id: 1,
      name: 'Retirement Fund',
      target: 1000000,
      current: 250000,
      deadline: '2040-01-01',
      progress: 25
    },
    {
      id: 2,
      name: 'New Home',
      target: 500000,
      current: 120000,
      deadline: '2026-01-01',
      progress: 24
    }
  ];

  const sectorPerformance = [
    { name: 'Technology', value: 12.5, change: 1.2 },
    { name: 'Healthcare', value: 8.7, change: 0.8 },
    { name: 'Financials', value: 5.3, change: -0.5 },
    { name: 'Consumer Discretionary', value: 10.2, change: 0.9 },
    { name: 'Industrials', value: 7.8, change: 0.3 },
    { name: 'Energy', value: 15.1, change: 2.1 }
  ];

  const communityLeaderboard = [
    { rank: 1, name: 'Alex Johnson', return: 24.5 },
    { rank: 2, name: 'Sam Wilson', return: 21.8 },
    { rank: 3, name: 'Taylor Swift', return: 19.3 },
    { rank: 4, name: 'Jordan Lee', return: 17.6 },
    { rank: 5, name: 'Casey Kim', return: 15.9 }
  ];

  const simulationData = {
    initialInvestment: 10000,
    currentValue: 12500,
    totalReturn: 25.0,
    startDate: '2023-01-01',
    participants: 1542,
    stats: {
      averageReturn: 18.7,
      totalTrades: 1245,
      totalValue: 12500000,
      activeUsers: 876
    },
    topPerformers: [
      { rank: 1, username: 'Alex Johnson', return: 24.5, portfolio: 12450 },
      { rank: 2, username: 'Sam Wilson', return: 21.8, portfolio: 11800 },
      { rank: 3, username: 'Taylor Swift', return: 19.3, portfolio: 11000 }
    ],
    trades: [
      { date: '2023-01-15', symbol: 'AAPL', action: 'BUY', shares: 10, price: 150.25 },
      { date: '2023-02-20', symbol: 'MSFT', action: 'BUY', shares: 5, price: 250.75 },
      { date: '2023-03-10', symbol: 'GOOGL', action: 'BUY', shares: 15, price: 95.50 }
    ]
  };

  // Generate the file content
  const fileContent = `// Auto-generated from Excel data
// Last updated: ${new Date().toISOString()}

// Helper function to format numbers
const formatNumber = (num) => {
  if (num >= 1000000000) {
    return '\\$' + (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return '\\$' + (num / 1000000).toFixed(2) + 'M';
  }
  return '\\$' + num.toLocaleString();
};

export const keyMetrics = ${JSON.stringify({
    portfolioValue: portfolioPerformance.currentValue,
    weeklyReturn: 3.2,
    winRate: 78,
    totalTrades: 45,
    activeGoals: financialGoals.length
  }, null, 2)};

export const watchlist = ${JSON.stringify(watchlist, null, 2)};

export const portfolioPerformance = ${JSON.stringify(portfolioPerformance, null, 2)};

export const stockAnalysis = ${JSON.stringify(stockAnalysis, null, 2)};

export const assetAllocation = ${JSON.stringify(assetAllocation, null, 2)};

export const recentTransactions = ${JSON.stringify(recentTransactions, null, 2)};

export const marketOverview = ${JSON.stringify(marketOverview, null, 2)};

export const newsUpdates = ${JSON.stringify(newsUpdates, null, 2)};

export const financialGoals = ${JSON.stringify(financialGoals, null, 2)};

export const sectorPerformance = ${JSON.stringify(sectorPerformance, null, 2)};

export const communityLeaderboard = ${JSON.stringify(communityLeaderboard, null, 2)};

export const simulationData = ${JSON.stringify(simulationData, null, 2)};`;

  // Write to file
  fs.writeFileSync(outputPath, fileContent);
  console.log('Dummy data updated at:', outputPath);
}

// Main function
function main() {
  const stocks = processExcelData();
  if (stocks.length > 0) {
    generateDummyData(stocks);
  } else {
    console.error('No data found in Excel file');
  }
}

main();
