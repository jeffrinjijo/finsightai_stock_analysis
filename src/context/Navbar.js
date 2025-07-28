// Example: src/components/Navbar.js
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">FinSight AI</h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Theme: {theme}
      </button>
    </header>
  );
}

export default Navbar;
