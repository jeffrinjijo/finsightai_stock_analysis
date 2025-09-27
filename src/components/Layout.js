import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import Chatbot from "./Chatbot";

function Layout({ children }) {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useAuth();
  
  // For non-authenticated users, just render children without layout
  if (!currentUser) {
    return children;
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      {/* Navbar */}
      <Navbar onRefresh={() => window.location.reload()} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16">
        <div className="container mx-auto p-4">
          {children || <Outlet />}
        </div>
      </main>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default Layout;
