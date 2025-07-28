// src/components/ThemeToggle.js
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded"
    >
      Toggle {darkMode ? "Light" : "Dark"} Mode
    </button>
  );
}

export default ThemeToggle;
<div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6">
  <h1 className="text-3xl font-bold">This is a themed page!</h1>
</div>
