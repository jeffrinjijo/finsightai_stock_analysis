import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiLogOut, FiMenu, FiX, FiHome, FiPieChart, FiTarget, FiUser, FiTrendingUp, FiDollarSign, FiBookOpen } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/home", icon: FiHome },
  { name: "Dashboard", path: "/dashboard", icon: FiTrendingUp },
  { name: "Tech Stocks", path: "/tech-stocks", icon: FiTrendingUp },
  { name: "Simulate", path: "/simulate", icon: FiPieChart },
  { name: "Guide", path: "/guide", icon: FiBookOpen },
  { name: "Pricing", path: "/pricing", icon: FiDollarSign },
  { name: "Goals", path: "/goals", icon: FiTarget },
  { name: "Profile", path: "/profile", icon: FiUser },
];

export default function Navbar({ onRefresh }) {
  const { currentUser, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) await onRefresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-white/90 dark:bg-gray-900/90 shadow-lg backdrop-blur border-b border-gray-200 dark:border-gray-700"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between">
        {/* Logo & App Name - create one div and inside that logo and company name should come and give style items start or justify start check this css*/}
        
        <Link to="/home" className="flex items-center gap-2 font-bold text-xl text-indigo-700 dark:text-indigo-400">
          <span className="bg-indigo-600 text-white rounded-full px-2 py-1 text-lg">💹</span>
          FinSight <span className="hidden sm:inline">AI</span>
        </Link>

        {/* Desktop Nav Links - css - center*/}
        <div className="hidden md:flex items-center gap-2 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          ))}
          <motion.button
            onClick={handleRefresh}
            className="ml-4 p-2 rounded-full hover:bg-indigo-50 text-indigo-600 relative"
            animate={{ rotate: refreshing ? 360 : 0 }}
            transition={{ repeat: refreshing ? Infinity : 0, duration: 0.7, ease: "linear" }}
            aria-label="Refresh"
          >
            <FiRefreshCw size={22} />
          </motion.button>
          <button
            onClick={handleLogout}
            className="ml-2 p-2 rounded-full hover:bg-red-50 text-red-500"
            aria-label="Logout"
          >
            <FiLogOut size={22} />
          </button>
        </div>
        <div className="justify-end items-end"></div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {currentUser && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Refresh data"
            >
              <motion.span
                animate={{ rotate: refreshing ? 360 : 0 }}
                transition={{ duration: 0.8, repeat: refreshing ? Infinity : 0, ease: "linear" }}
              >
                <FiRefreshCw className="w-5 h-5" />
              </motion.span>
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-4 py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 ${
                    location.pathname === link.path
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
              {currentUser && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
