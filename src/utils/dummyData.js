// Auto-generated from Excel data
// Last updated: 2025-09-11T10:45:24.977Z

// Helper function to format numbers
const formatNumber = (num) => {
  if (num >= 1000000000) {
    return '\$' + (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return '\$' + (num / 1000000).toFixed(2) + 'M';
  }
  return '\$' + num.toLocaleString();
};

export const keyMetrics = {
  "portfolioValue": 28999000,
  "weeklyReturn": 3.2,
  "winRate": 78,
  "totalTrades": 45,
  "activeGoals": 2
};

export const watchlist = [
  {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "price": 170.76,
    "change": 0.08,
    "changePercent": 0.08,
    "marketCap": "$4100B",
    "peRatio": 50.5,
    "dividendYield": "~0.02%"
  },
  {
    "symbol": "MSFT",
    "name": "Microsoft Corp.",
    "price": 498.41,
    "change": -0.013,
    "changePercent": -0.013,
    "marketCap": "$3720B",
    "peRatio": 36.4,
    "dividendYield": "~0.7%"
  },
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 234.35,
    "change": 2,
    "changePercent": 2,
    "marketCap": "$3365B",
    "peRatio": 35,
    "dividendYield": "~0.4%"
  },
  {
    "symbol": "GOOGL",
    "name": "Alphabet Inc.",
    "price": 239.56,
    "change": -0.0016,
    "changePercent": -0.0016,
    "marketCap": "$2892B",
    "peRatio": 25.1,
    "dividendYield": "~0.4%"
  },
  {
    "symbol": "AMZN",
    "name": "Amazon.com, Inc.",
    "price": 238.24,
    "change": 5.7,
    "changePercent": 5.7,
    "marketCap": "$2456B",
    "peRatio": 36,
    "dividendYield": "~n/a"
  },
  {
    "symbol": "META",
    "name": "Meta Platforms, Inc.",
    "price": 765.7,
    "change": -0.0179,
    "changePercent": -0.0179,
    "marketCap": "$1889B",
    "peRatio": 26.9,
    "dividendYield": "~0.3%"
  },
  {
    "symbol": "AVGO",
    "name": "Broadcom Inc.",
    "price": 336.67,
    "change": 12.9,
    "changePercent": 12.9,
    "marketCap": "$1738B",
    "peRatio": 84.2,
    "dividendYield": "~0.7%"
  },
  {
    "symbol": "TSLA",
    "name": "Tesla, Inc.",
    "price": 346.97,
    "change": 0.24,
    "changePercent": 0.24,
    "marketCap": "$1121B",
    "peRatio": 190.4,
    "dividendYield": "~n/a"
  },
  {
    "symbol": "BRK.B",
    "name": "Berkshire Hathaway Inc.",
    "price": 490.08,
    "change": -0.0054,
    "changePercent": -0.0054,
    "marketCap": "$1058B",
    "peRatio": 16.9,
    "dividendYield": "~n/a"
  },
  {
    "symbol": "JPM",
    "name": "JPMorgan Chase & Co.",
    "price": 300.54,
    "change": 0.9,
    "changePercent": 0.9,
    "marketCap": "$826B",
    "peRatio": 15.4,
    "dividendYield": "~1.78%"
  },
  {
    "symbol": "WMT",
    "name": "Walmart Inc.",
    "price": 100.41,
    "change": -0.0184,
    "changePercent": -0.0184,
    "marketCap": "$800B",
    "peRatio": 38.2,
    "dividendYield": "~0.9%"
  },
  {
    "symbol": "ORCL",
    "name": "Oracle Corporation",
    "price": 328.33,
    "change": 35.95,
    "changePercent": 35.95,
    "marketCap": "$922B",
    "peRatio": 54.5,
    "dividendYield": "~0.8%"
  },
  {
    "symbol": "LLY",
    "name": "Eli Lilly & Co.",
    "price": 750.61,
    "change": 2.1,
    "changePercent": 2.1,
    "marketCap": "$673B",
    "peRatio": 48.8,
    "dividendYield": "~0.8%"
  },
  {
    "symbol": "V",
    "name": "Visa Inc.",
    "price": 343.99,
    "change": -0.0171,
    "changePercent": -0.0171,
    "marketCap": "$651B",
    "peRatio": 33,
    "dividendYield": "~0.7%"
  },
  {
    "symbol": "NFLX",
    "name": "Netflix, Inc.",
    "price": 1263.25,
    "change": 4,
    "changePercent": 4,
    "marketCap": "$536B",
    "peRatio": 52.4,
    "dividendYield": "~n/a"
  },
  {
    "symbol": "MA",
    "name": "Mastercard, Inc.",
    "price": 584,
    "change": -0.013,
    "changePercent": -0.013,
    "marketCap": "$523B",
    "peRatio": 38.9,
    "dividendYield": "~0.5%"
  },
  {
    "symbol": "XOM",
    "name": "Exxon Mobil Corporation",
    "price": 110.65,
    "change": 1.67,
    "changePercent": 1.67,
    "marketCap": "$471B",
    "peRatio": 15.2,
    "dividendYield": "~3.6%"
  },
  {
    "symbol": "COST",
    "name": "Costco Wholesale Corporation",
    "price": 979.25,
    "change": 4.3,
    "changePercent": 4.3,
    "marketCap": "$424B",
    "peRatio": 55.4,
    "dividendYield": "~0.5%"
  },
  {
    "symbol": "JNJ",
    "name": "Johnson & Johnson",
    "price": 176.96,
    "change": -0.006,
    "changePercent": -0.006,
    "marketCap": "$423B",
    "peRatio": 18.8,
    "dividendYield": "~2.9%"
  },
  {
    "symbol": "HD",
    "name": "Home Depot, Inc.",
    "price": 415.34,
    "change": 2.2,
    "changePercent": 2.2,
    "marketCap": "$411B",
    "peRatio": 28.3,
    "dividendYield": "~2.2%"
  }
];

export const portfolioPerformance = {
  "currentValue": 28999000,
  "totalReturn": 12.5,
  "chartData": [
    {
      "date": "Jan",
      "value": 23199200
    },
    {
      "date": "Feb",
      "value": 24649150
    },
    {
      "date": "Mar",
      "value": 26099100
    },
    {
      "date": "Apr",
      "value": 26679080
    },
    {
      "date": "May",
      "value": 27549050
    },
    {
      "date": "Jun",
      "value": 28999000
    },
    {
      "date": "Jul",
      "value": 30448950
    },
    {
      "date": "Aug",
      "value": 31898900
    },
    {
      "date": "Sep",
      "value": 34798800
    }
  ]
};

export const stockAnalysis = {
  "NVDA": {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "price": 170.76,
    "change": 0.08,
    "changePercent": 0.08,
    "marketCap": "$4100B",
    "peRatio": 50.5,
    "dividendYield": "~0.02%",
    "oneWeekReturn": 5.2,
    "oneMonthReturn": 46.1,
    "sector": "Technology",
    "volume": 1707600,
    "avgVolume": 853800,
    "high52Week": 221.99,
    "low52Week": 136.61,
    "beta": "0.25"
  },
  "MSFT": {
    "symbol": "MSFT",
    "name": "Microsoft Corp.",
    "price": 498.41,
    "change": -0.013,
    "changePercent": -0.013,
    "marketCap": "$3720B",
    "peRatio": 36.4,
    "dividendYield": "~0.7%",
    "oneWeekReturn": 3.8,
    "oneMonthReturn": 20.3,
    "sector": "Technology",
    "volume": 4984100,
    "avgVolume": 2492050,
    "high52Week": 647.93,
    "low52Week": 398.73,
    "beta": "1.80"
  },
  "AAPL": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 234.35,
    "change": 2,
    "changePercent": 2,
    "marketCap": "$3365B",
    "peRatio": 35,
    "dividendYield": "~0.4%",
    "oneWeekReturn": 4.7,
    "oneMonthReturn": 6.5,
    "sector": "Technology",
    "volume": 2343500,
    "avgVolume": 1171750,
    "high52Week": 304.66,
    "low52Week": 187.48,
    "beta": "1.93"
  },
  "GOOGL": {
    "symbol": "GOOGL",
    "name": "Alphabet Inc.",
    "price": 239.56,
    "change": -0.0016,
    "changePercent": -0.0016,
    "marketCap": "$2892B",
    "peRatio": 25.1,
    "dividendYield": "~0.4%",
    "oneWeekReturn": 3.1,
    "oneMonthReturn": 58.5,
    "sector": "Technology",
    "volume": 2395600,
    "avgVolume": 1197800,
    "high52Week": 311.43,
    "low52Week": 191.65,
    "beta": "1.63"
  },
  "AMZN": {
    "symbol": "AMZN",
    "name": "Amazon.com, Inc.",
    "price": 238.24,
    "change": 5.7,
    "changePercent": 5.7,
    "marketCap": "$2456B",
    "peRatio": 36,
    "dividendYield": "~n/a",
    "oneWeekReturn": 10,
    "oneMonthReturn": 32.7,
    "sector": "Technology",
    "volume": 2382400,
    "avgVolume": 1191200,
    "high52Week": 309.71,
    "low52Week": 190.59,
    "beta": "0.67"
  },
  "META": {
    "symbol": "META",
    "name": "Meta Platforms, Inc.",
    "price": 765.7,
    "change": -0.0179,
    "changePercent": -0.0179,
    "marketCap": "$1889B",
    "peRatio": 26.9,
    "dividendYield": "~0.3%",
    "oneWeekReturn": 7,
    "oneMonthReturn": 51.7,
    "sector": "Technology",
    "volume": 7657000,
    "avgVolume": 3828500,
    "high52Week": 995.41,
    "low52Week": 612.56,
    "beta": "1.42"
  },
  "AVGO": {
    "symbol": "AVGO",
    "name": "Broadcom Inc.",
    "price": 336.67,
    "change": 12.9,
    "changePercent": 12.9,
    "marketCap": "$1738B",
    "peRatio": 84.2,
    "dividendYield": "~0.7%",
    "oneWeekReturn": 8.5,
    "oneMonthReturn": 127.2,
    "sector": "Technology",
    "volume": 3366700,
    "avgVolume": 1683350,
    "high52Week": 437.67,
    "low52Week": 269.34,
    "beta": "0.77"
  },
  "TSLA": {
    "symbol": "TSLA",
    "name": "Tesla, Inc.",
    "price": 346.97,
    "change": 0.24,
    "changePercent": 0.24,
    "marketCap": "$1121B",
    "peRatio": 190.4,
    "dividendYield": "~n/a",
    "oneWeekReturn": 4.5,
    "oneMonthReturn": 52.1,
    "sector": "Technology",
    "volume": 3469700,
    "avgVolume": 1734850,
    "high52Week": 451.06,
    "low52Week": 277.58,
    "beta": "0.47"
  },
  "BRK.B": {
    "symbol": "BRK.B",
    "name": "Berkshire Hathaway Inc.",
    "price": 490.08,
    "change": -0.0054,
    "changePercent": -0.0054,
    "marketCap": "$1058B",
    "peRatio": 16.9,
    "dividendYield": "~n/a",
    "oneWeekReturn": 3.2,
    "oneMonthReturn": 8.6,
    "sector": "Technology",
    "volume": 4900800,
    "avgVolume": 2450400,
    "high52Week": 637.1,
    "low52Week": 392.06,
    "beta": "1.44"
  },
  "JPM": {
    "symbol": "JPM",
    "name": "JPMorgan Chase & Co.",
    "price": 300.54,
    "change": 0.9,
    "changePercent": 0.9,
    "marketCap": "$826B",
    "peRatio": 15.4,
    "dividendYield": "~1.78%",
    "oneWeekReturn": 2.1,
    "oneMonthReturn": 44.9,
    "sector": "Technology",
    "volume": 3005400,
    "avgVolume": 1502700,
    "high52Week": 390.7,
    "low52Week": 240.43,
    "beta": "1.11"
  },
  "WMT": {
    "symbol": "WMT",
    "name": "Walmart Inc.",
    "price": 100.41,
    "change": -0.0184,
    "changePercent": -0.0184,
    "marketCap": "$800B",
    "peRatio": 38.2,
    "dividendYield": "~0.9%",
    "oneWeekReturn": 2,
    "oneMonthReturn": 29.8,
    "sector": "Technology",
    "volume": 1004100,
    "avgVolume": 502050,
    "high52Week": 130.53,
    "low52Week": 80.33,
    "beta": "0.74"
  },
  "ORCL": {
    "symbol": "ORCL",
    "name": "Oracle Corporation",
    "price": 328.33,
    "change": 35.95,
    "changePercent": 35.95,
    "marketCap": "$922B",
    "peRatio": 54.5,
    "dividendYield": "~0.8%",
    "oneWeekReturn": 20,
    "oneMonthReturn": 54.9,
    "sector": "Technology",
    "volume": 3283300,
    "avgVolume": 1641650,
    "high52Week": 426.83,
    "low52Week": 262.66,
    "beta": "0.59"
  },
  "LLY": {
    "symbol": "LLY",
    "name": "Eli Lilly & Co.",
    "price": 750.61,
    "change": 2.1,
    "changePercent": 2.1,
    "marketCap": "$673B",
    "peRatio": 48.8,
    "dividendYield": "~0.8%",
    "oneWeekReturn": -0.015,
    "oneMonthReturn": -0.167,
    "sector": "Technology",
    "volume": 7506100,
    "avgVolume": 3753050,
    "high52Week": 975.79,
    "low52Week": 600.49,
    "beta": "1.35"
  },
  "V": {
    "symbol": "V",
    "name": "Visa Inc.",
    "price": 343.99,
    "change": -0.0171,
    "changePercent": -0.0171,
    "marketCap": "$651B",
    "peRatio": 33,
    "dividendYield": "~0.7%",
    "oneWeekReturn": 1.8,
    "oneMonthReturn": 20.6,
    "sector": "Technology",
    "volume": 3439900,
    "avgVolume": 1719950,
    "high52Week": 447.19,
    "low52Week": 275.19,
    "beta": "0.20"
  },
  "NFLX": {
    "symbol": "NFLX",
    "name": "Netflix, Inc.",
    "price": 1263.25,
    "change": 4,
    "changePercent": 4,
    "marketCap": "$536B",
    "peRatio": 52.4,
    "dividendYield": "~n/a",
    "oneWeekReturn": 5.5,
    "oneMonthReturn": 87.5,
    "sector": "Technology",
    "volume": 12632500,
    "avgVolume": 6316250,
    "high52Week": 1642.23,
    "low52Week": 1010.6,
    "beta": "1.47"
  },
  "MA": {
    "symbol": "MA",
    "name": "Mastercard, Inc.",
    "price": 584,
    "change": -0.013,
    "changePercent": -0.013,
    "marketCap": "$523B",
    "peRatio": 38.9,
    "dividendYield": "~0.5%",
    "oneWeekReturn": 3.5,
    "oneMonthReturn": 19.7,
    "sector": "Technology",
    "volume": 5840000,
    "avgVolume": 2920000,
    "high52Week": 759.2,
    "low52Week": 467.2,
    "beta": "0.49"
  },
  "XOM": {
    "symbol": "XOM",
    "name": "Exxon Mobil Corporation",
    "price": 110.65,
    "change": 1.67,
    "changePercent": 1.67,
    "marketCap": "$471B",
    "peRatio": 15.2,
    "dividendYield": "~3.6%",
    "oneWeekReturn": 2.4,
    "oneMonthReturn": -0.002,
    "sector": "Technology",
    "volume": 1106500,
    "avgVolume": 553250,
    "high52Week": 143.85,
    "low52Week": 88.52,
    "beta": "0.09"
  },
  "COST": {
    "symbol": "COST",
    "name": "Costco Wholesale Corporation",
    "price": 979.25,
    "change": 4.3,
    "changePercent": 4.3,
    "marketCap": "$424B",
    "peRatio": 55.4,
    "dividendYield": "~0.5%",
    "oneWeekReturn": 6,
    "oneMonthReturn": 9.5,
    "sector": "Technology",
    "volume": 9792500,
    "avgVolume": 4896250,
    "high52Week": 1273.03,
    "low52Week": 783.4,
    "beta": "1.34"
  },
  "JNJ": {
    "symbol": "JNJ",
    "name": "Johnson & Johnson",
    "price": 176.96,
    "change": -0.006,
    "changePercent": -0.006,
    "marketCap": "$423B",
    "peRatio": 18.8,
    "dividendYield": "~2.9%",
    "oneWeekReturn": 1.4,
    "oneMonthReturn": 5.7,
    "sector": "Technology",
    "volume": 1769600,
    "avgVolume": 884800,
    "high52Week": 230.05,
    "low52Week": 141.57,
    "beta": "0.13"
  },
  "HD": {
    "symbol": "HD",
    "name": "Home Depot, Inc.",
    "price": 415.34,
    "change": 2.2,
    "changePercent": 2.2,
    "marketCap": "$411B",
    "peRatio": 28.3,
    "dividendYield": "~2.2%",
    "oneWeekReturn": 3,
    "oneMonthReturn": 12,
    "sector": "Technology",
    "volume": 4153399,
    "avgVolume": 2076699,
    "high52Week": 539.94,
    "low52Week": 332.27,
    "beta": "1.34"
  }
};

export const assetAllocation = [
  {
    "name": "Stocks",
    "value": 75
  },
  {
    "name": "Bonds",
    "value": 15
  },
  {
    "name": "Cash",
    "value": 10
  }
];

export const recentTransactions = [
  {
    "id": 1,
    "symbol": "AAPL",
    "type": "BUY",
    "shares": 5,
    "price": 234.35,
    "date": "2025-09-11T10:45:24.977Z",
    "status": "Completed"
  },
  {
    "id": 2,
    "symbol": "MSFT",
    "type": "BUY",
    "shares": 3,
    "price": 498.41,
    "date": "2025-09-10T10:45:24.977Z",
    "status": "Completed"
  }
];

export const marketOverview = {
  "sp500": {
    "value": 4500.12,
    "change": 0.8
  },
  "nasdaq": {
    "value": 15250.34,
    "change": 1.2
  },
  "dow": {
    "value": 34500.67,
    "change": 0.5
  },
  "vix": {
    "value": 16.5,
    "change": -2.1
  }
};

export const newsUpdates = [
  {
    "id": 1,
    "title": "Tech Stocks Rally as Market Shows Strong Recovery",
    "source": "Financial Times",
    "date": "2025-09-11T10:45:24.977Z",
    "summary": "Technology stocks lead the market with significant gains this week.",
    "url": "#",
    "relatedStocks": [
      "AAPL",
      "MSFT",
      "GOOGL"
    ]
  },
  {
    "id": 2,
    "title": "NVIDIA Announces New AI Chip",
    "source": "TechCrunch",
    "date": "2025-09-10T10:45:24.977Z",
    "summary": "NVIDIA unveils next-generation AI processor with 10x performance boost.",
    "url": "#",
    "relatedStocks": [
      "NVDA"
    ]
  }
];

export const financialGoals = [
  {
    "id": 1,
    "name": "Retirement Fund",
    "target": 1000000,
    "current": 250000,
    "deadline": "2040-01-01",
    "progress": 25
  },
  {
    "id": 2,
    "name": "New Home",
    "target": 500000,
    "current": 120000,
    "deadline": "2026-01-01",
    "progress": 24
  }
];

export const sectorPerformance = [
  {
    "name": "Technology",
    "value": 12.5,
    "change": 1.2
  },
  {
    "name": "Healthcare",
    "value": 8.7,
    "change": 0.8
  },
  {
    "name": "Financials",
    "value": 5.3,
    "change": -0.5
  },
  {
    "name": "Consumer Discretionary",
    "value": 10.2,
    "change": 0.9
  },
  {
    "name": "Industrials",
    "value": 7.8,
    "change": 0.3
  },
  {
    "name": "Energy",
    "value": 15.1,
    "change": 2.1
  }
];

export const communityLeaderboard = [
  {
    "rank": 1,
    "name": "Alex Johnson",
    "return": 24.5
  },
  {
    "rank": 2,
    "name": "Sam Wilson",
    "return": 21.8
  },
  {
    "rank": 3,
    "name": "Taylor Swift",
    "return": 19.3
  },
  {
    "rank": 4,
    "name": "Jordan Lee",
    "return": 17.6
  },
  {
    "rank": 5,
    "name": "Casey Kim",
    "return": 15.9
  }
];

export const simulationData = {
  "initialInvestment": 10000,
  "currentValue": 12500,
  "totalReturn": 25,
  "startDate": "2023-01-01",
  "participants": 1542,
  "stats": {
    "averageReturn": 18.7,
    "totalTrades": 1245,
    "totalValue": 12500000,
    "activeUsers": 876
  },
  "topPerformers": [
    {
      "rank": 1,
      "username": "Alex Johnson",
      "return": 24.5,
      "portfolio": 12450
    },
    {
      "rank": 2,
      "username": "Sam Wilson",
      "return": 21.8,
      "portfolio": 11800
    },
    {
      "rank": 3,
      "username": "Taylor Swift",
      "return": 19.3,
      "portfolio": 11000
    }
  ],
  "trades": [
    {
      "date": "2023-01-15",
      "symbol": "AAPL",
      "action": "BUY",
      "shares": 10,
      "price": 150.25
    },
    {
      "date": "2023-02-20",
      "symbol": "MSFT",
      "action": "BUY",
      "shares": 5,
      "price": 250.75
    },
    {
      "date": "2023-03-10",
      "symbol": "GOOGL",
      "action": "BUY",
      "shares": 15,
      "price": 95.5
    }
  ]
};