import { useState, useEffect, useCallback } from 'react';
import { 
  calculateSMA, 
  calculateEMA, 
  calculateRSI, 
  generateSignals, 
  calculatePerformance 
} from '../utils/technicalAnalysis';

const useTechnicalAnalysis = (prices = []) => {
  const [analysis, setAnalysis] = useState({
    sma20: [],
    sma50: [],
    sma200: [],
    ema12: [],
    ema26: [],
    rsi: [],
    signals: [],
    performance: null,
    isLoading: false,
    error: null
  });

  const analyze = useCallback(() => {
    if (!prices || prices.length === 0) return;

    setAnalysis(prev => ({ ...prev, isLoading: true }));

    try {
      // Ensure we have enough data
      const minDataPoints = Math.max(200, prices.length);
      const priceValues = prices.map(p => typeof p === 'number' ? p : p.close || p.price);
      
      // Calculate indicators
      const sma20 = calculateSMA(priceValues, 20);
      const sma50 = calculateSMA(priceValues, 50);
      const sma200 = calculateSMA(priceValues, 200);
      const ema12 = calculateEMA(priceValues, 12);
      const ema26 = calculateEMA(priceValues, 26);
      const rsi = calculateRSI(priceValues, 14);
      
      // Generate trading signals
      const signals = generateSignals(priceValues);
      
      // Calculate performance
      const performance = calculatePerformance(priceValues, signals);

      setAnalysis({
        sma20,
        sma50,
        sma200,
        ema12,
        ema26,
        rsi,
        signals,
        performance,
        isLoading: false,
        error: null
      });

      return {
        sma20,
        sma50,
        sma200,
        ema12,
        ema26,
        rsi,
        signals,
        performance
      };
    } catch (error) {
      console.error('Error in technical analysis:', error);
      setAnalysis(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      return null;
    }
  }, [prices]);

  // Auto-analyze when prices change
  useEffect(() => {
    if (prices && prices.length > 0) {
      analyze();
    }
  }, [prices, analyze]);

  return {
    ...analysis,
    analyze,
    getLatestSignal: () => {
      if (!analysis.signals || analysis.signals.length === 0) return null;
      return analysis.signals[analysis.signals.length - 1];
    },
    getLatestRSI: () => {
      if (!analysis.rsi || analysis.rsi.length === 0) return null;
      const nonNullRSI = analysis.rsi.filter(val => val !== null);
      return nonNullRSI.length > 0 ? nonNullRSI[nonNullRSI.length - 1] : null;
    },
    getMovingAverages: () => ({
      sma20: analysis.sma20[analysis.sma20.length - 1],
      sma50: analysis.sma50[analysis.sma50.length - 1],
      sma200: analysis.sma200[analysis.sma200.length - 1],
      ema12: analysis.ema12[analysis.ema12.length - 1],
      ema26: analysis.ema26[analysis.ema26.length - 1]
    })
  };
};

export default useTechnicalAnalysis;
