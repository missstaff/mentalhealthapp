// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Export a hook for easy usage of ThemeContext
export const useThemeContext = () => useContext(ThemeContext);

// ThemeProvider component to wrap around the app
export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Load theme from storage or system preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme) {
          setTheme(storedTheme);
        } else {
          const colorScheme = Appearance.getColorScheme();
          setTheme(colorScheme || 'light');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();

    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme ?? 'light');
    });

    return () => subscription.remove();
  }, []);

  // Function to toggle theme and save preference
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('appTheme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
