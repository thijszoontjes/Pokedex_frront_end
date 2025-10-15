import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme } from './theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ReturnType<typeof createTheme>;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  // Determine if we should use dark mode
  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  const theme = createTheme(isDark);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    // TODO: Add persistence with AsyncStorage later
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for getting colors (for components that don't need full theme)
export function useColors() {
  const { theme } = useTheme();
  return theme.colors;
}

// Hook for checking if dark mode is active
export function useIsDark() {
  const { isDark } = useTheme();
  return isDark;
}