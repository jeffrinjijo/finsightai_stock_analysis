import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTarget, FiBarChart2, FiAlertTriangle } from "react-icons/fi";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Portfolio Analysis",
    description: "Analyze your investments",
    icon: <FiTrendingUp className="text-2xl md:text-3xl" />,
    color: "from-purple-500 to-indigo-500",
    path: "/portfolio/analysis"
  },
  {
    title: "Goal Tracker",
    description: "Track financial goals",
    icon: <FiTarget className="text-2xl md:text-3xl" />,
    color: "from-blue-500 to-cyan-500",
    path: "/goals"
  },
  {
    title: "Market Watch",
    description: "Live market data",
    icon: <FiBarChart2 className="text-2xl md:text-3xl" />,
    color: "from-green-500 to-emerald-500",
    path: "/markets"
  },
  {
    title: "Risk Analyzer",
    description: "Assess risk tolerance",
    icon: <FiAlertTriangle className="text-2xl md:text-3xl" />,
    color: "from-amber-500 to-orange-500",
    path: "/risk-analyzer"
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
          <Link to={action.path} className="block p-6">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-4`}>
              {action.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">{action.description}</p>
            <div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
              Explore →
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
