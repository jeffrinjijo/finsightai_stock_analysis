import React from "react";
import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function SimulationBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-800 rounded-2xl p-6 overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to test your strategy?</h2>
            <p className="text-indigo-100 dark:text-indigo-200">
              Try our risk-free simulation to see how your investment decisions would perform in real market conditions.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 md:mt-0"
          >
            <Link
              to="/simulate"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiZap className="mr-2" />
              Start Simulation
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
    </motion.div>
  );
}
