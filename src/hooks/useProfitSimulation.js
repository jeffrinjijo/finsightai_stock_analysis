
import { useState, useEffect, useCallback } from 'react';
import { getStockQuote, getStockHistory } from '../services/alphaVantage';

const useProfitSimulation = (symbols) => {
  const [profitData, setProfitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateSimulationData = useCallback(async () => {
    if (!symbols || symbols.length === 0) {
      setProfitData([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get historical data for all symbols
      const historicalData = {};
      
      // Fetch historical data for each symbol
      await Promise.all(symbols.map(async (symbol) => {
        try {
          const history = await getStockHistory(symbol, 'DAILY');
          if (history?.['Time Series (Daily)']) {
            historicalData[symbol] = history['Time Series (Daily)'];
          }
        } catch (err) {
          console.error(`Error fetching history for ${symbol}:`, err);
        }
      }));
      
      if (Object.keys(historicalData).length === 0) {
        throw new Error('No historical data available');
      }
      
      // Get the last 7 trading days from the first symbol that has data
      const firstSymbolWithData = Object.keys(historicalData)[0];
      const tradingDays = Object.keys(historicalData[firstSymbolWithData] || {})
        .sort()
        .slice(-7);
      
      // Generate profit data based on actual price movements
      const profitData = tradingDays.map((date) => {
        let totalProfit = 0;
        const dayOfWeek = new Date(date).getDay();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Calculate profit for each stock
        Object.values(historicalData).forEach((symbolData) => {
          const dailyData = symbolData[date];
          if (dailyData) {
            const open = parseFloat(dailyData['1. open']);
            const close = parseFloat(dailyData['4. close']);
            const profit = (close - open) * 10; // Assuming 10 shares per stock
            totalProfit += profit;
          }
        });
        
        return {
          day: dayNames[dayOfWeek],
          profit: parseFloat(totalProfit.toFixed(2)),
          date
        };
      });

      setProfitData(profitData);
    } catch (err) {
      console.error('Error generating profit simulation:', err);
      setError('Failed to load profit simulation data. Please try again later.');
      setProfitData([]);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    if (symbols && symbols.length > 0) {
      generateSimulationData();
      
      // Refresh data every 5 minutes
      const interval = setInterval(generateSimulationData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [symbols, generateSimulationData]);

  return {
    profitData,
    loading,
    error,
    refresh: generateSimulationData
  };
};

export default useProfitSimulation;
