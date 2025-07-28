import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import Chatbot from "./Chatbot";

function Layout({ children }) {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const location = useLocation();
  
  // For non-authenticated users, just render children without layout
  if (!currentUser) {
    return children;
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      {/* Navbar */}
      <Navbar onRefresh={() => window.location.reload()} />
      
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed md:static z-30 transform transition-transform duration-300 ease-in-out
            ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
            w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
            h-[calc(100vh-4rem)] md:h-auto overflow-y-auto flex flex-col
          `}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                FinSight AI
              </h1>
              <button 
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <div className="px-4 py-2 border-t border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {[
              { name: 'Home', path: '/', icon: '🏠' },
              { name: 'Portfolio', path: '/portfolio', icon: '📈' },
              { name: 'Market', path: '/market', icon: '📊' },
              { name: 'News', path: '/news', icon: '📰' },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${
                    window.location.pathname === item.path
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
                <span className="text-sm">{item.name}</span>
              </a>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-300 text-sm">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {currentUser?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentUser?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="p-4 md:p-6">
            {/* Mobile menu button */}
            <button 
              className="md:hidden mb-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Page content */}
            <div className="w-full max-w-7xl mx-auto px-4 py-6">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
      
      {/* Chatbot - Only show when user is authenticated */}
      {currentUser && <Chatbot />}
    </div>
  );
}

export default Layout;
