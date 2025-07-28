import React from "react";
import { motion } from "framer-motion";

export default function WelcomeBanner({ 
  experienceLevel = "Experienced",
  userName = 'Investor',
  portfolioValue = 0,
  weeklyReturn = 0
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const greetings = {
    Beginner: `👋 Welcome, ${userName.split(' ')[0]}!`,
    Intermediate: `🚀 Great to see you back, ${userName.split(' ')[0]}!`,
    Experienced: `💼 Welcome back, ${userName.split(' ')[0]}!`
  };

  // Safely parse weekly return
  const safeWeeklyReturn = typeof weeklyReturn === 'number' 
    ? weeklyReturn 
    : typeof weeklyReturn === 'string' 
      ? parseFloat(weeklyReturn.replace(/[^0-9.-]+/g, '')) || 0 
      : 0;

  const formatReturn = (value) => {
    const numValue = parseFloat(value) || 0;
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
  };

  const tips = {
    Beginner: `Your portfolio is worth ${formatCurrency(portfolioValue)} ${safeWeeklyReturn >= 0 ? '📈' : '📉'} ${formatReturn(safeWeeklyReturn)} this week`,
    Intermediate: `Your portfolio is worth ${formatCurrency(portfolioValue)} ${safeWeeklyReturn >= 0 ? '📈' : '📉'} ${formatReturn(safeWeeklyReturn)} this week`,
    Experienced: `Portfolio: ${formatCurrency(portfolioValue)} • Weekly: ${safeWeeklyReturn >= 0 ? '↑' : '↓'} ${Math.abs(safeWeeklyReturn).toFixed(2)}%`
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {greetings[experienceLevel] || greetings.Experienced}
            </h1>
            <p className="text-blue-100 dark:text-blue-200 max-w-2xl">
              {tips[experienceLevel] || tips.Experienced} Here's your personalized dashboard overview.
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 md:mt-0"
          >
            <button className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-md">
              View Full Report
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
    </motion.div>
  );
}
