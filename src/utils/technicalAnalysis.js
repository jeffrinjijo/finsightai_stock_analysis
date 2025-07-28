/**
 * Technical Analysis Utilities
 * Contains common technical indicators and analysis functions
 */

// Calculate Simple Moving Average (SMA)
export const calculateSMA = (values, period) => {
  return values.map((_, index, array) => {
    if (index < period - 1) return null;
    const sum = array.slice(index - period + 1, index + 1).reduce((a, b) => a + b, 0);
    return sum / period;
  });
};

// Calculate Exponential Moving Average (EMA)
export const calculateEMA = (values, period) => {
  const k = 2 / (period + 1);
  const ema = [values[0]]; // Start with the first value
  
  for (let i = 1; i < values.length; i++) {
    ema.push(values[i] * k + ema[i - 1] * (1 - k));
  }
  
  return ema;
};

// Calculate Relative Strength Index (RSI)
export const calculateRSI = (prices, period = 14) => {
  const deltas = [];
  
  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    deltas.push(prices[i] - prices[i - 1]);
  }
  
  const gains = [];
  const losses = [];
  
  // Separate gains and losses
  for (const delta of deltas) {
    if (delta >= 0) {
      gains.push(delta);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(delta));
    }
  }
  
  // Calculate average gains and losses
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  const rsi = [];
  
  // First RSI value
  const firstRS = avgGain / avgLoss;
  rsi.push(100 - (100 / (1 + firstRS)));
  
  // Calculate subsequent RSI values
  for (let i = period; i < prices.length - 1; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    
    const rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
  }
  
  // Pad the beginning with null values to match input length
  return Array(period).fill(null).concat(rsi);
};

// Generate trading signals based on moving average crossover
export const generateSignals = (prices, shortPeriod = 20, longPeriod = 50) => {
  const smaShort = calculateSMA(prices, shortPeriod);
  const smaLong = calculateSMA(prices, longPeriod);
  
  const signals = [];
  
  for (let i = 1; i < prices.length; i++) {
    // Skip if we don't have enough data for the long period
    if (i < longPeriod - 1) {
      signals.push({ type: 'HOLD', price: prices[i], index: i });
      continue;
    }
    
    // Check for crossover
    if (smaShort[i-1] <= smaLong[i-1] && smaShort[i] > smaLong[i]) {
      signals.push({ type: 'BUY', price: prices[i], index: i });
    } else if (smaShort[i-1] >= smaLong[i-1] && smaShort[i] < smaLong[i]) {
      signals.push({ type: 'SELL', price: prices[i], index: i });
    } else {
      signals.push({ type: 'HOLD', price: prices[i], index: i });
    }
  }
  
  return signals;
};

// Calculate performance metrics
export const calculatePerformance = (prices, signals) => {
  let position = null;
  let entryPrice = 0;
  const trades = [];
  
  // Process each signal
  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];
    
    if (signal.type === 'BUY' && position === null) {
      position = 'LONG';
      entryPrice = signal.price;
      trades.push({
        type: 'BUY',
        price: entryPrice,
        date: i,
        profit: null
      });
    } else if (signal.type === 'SELL' && position === 'LONG') {
      const exitPrice = signal.price;
      const profit = ((exitPrice - entryPrice) / entryPrice) * 100;
      
      trades.push({
        type: 'SELL',
        price: exitPrice,
        date: i,
        profit: profit
      });
      
      position = null;
    }
  }
  
  // Calculate metrics
  const profitableTrades = trades.filter(t => t.profit && t.profit > 0);
  const losingTrades = trades.filter(t => t.profit && t.profit <= 0);
  
  const totalReturn = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const winRate = trades.length > 0 ? (profitableTrades.length / trades.length) * 100 : 0;
  
  return {
    totalTrades: trades.length,
    profitableTrades: profitableTrades.length,
    losingTrades: losingTrades.length,
    winRate: winRate.toFixed(2) + '%',
    totalReturn: totalReturn.toFixed(2) + '%',
    avgProfit: trades.length > 0 ? (totalReturn / trades.length).toFixed(2) + '%' : '0%',
    trades: trades
  };
};
