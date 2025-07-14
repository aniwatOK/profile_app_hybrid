import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const constext = useContext(ThemeContext);
  if (!constext) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return constext;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    color: {
      background: isDarkMode ? "#000" : "#fff",
      text: isDarkMode ? "#fff" : "#000",
      textSecondary: isDarkMode ? "#ccc" : "#333",
      surface: isDarkMode ? "#121212" : "#f5f5f5",
      primary: isDarkMode ? "#bb86fc" : "#6200ee",
      secoundary: isDarkMode ? "#03dac6" : "#03dac5",
      error: isDarkMode ? "#cf6679" : "#b00020",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
