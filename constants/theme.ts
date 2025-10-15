// Light theme colors
export const lightColors = {
  bg: "#E9F0F7",
  panel: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  border: "#E5E7EB",
  badgeBg: "#7C3AED",
  badgeText: "#FFFFFF",
  primary: "#5631E8",
  loading: "#f0f8ff",
  white: "#FFFFFF",
  gray: "#666666",
  error: "#EF4444",
  success: "#10B981",
};

// Dark theme colors
export const darkColors = {
  bg: "#0F172A",
  panel: "#1E293B",
  text: "#F8FAFC",
  subtext: "#94A3B8",
  border: "#334155",
  badgeBg: "#7C3AED",
  badgeText: "#FFFFFF",
  primary: "#8B5CF6",
  loading: "#1E293B",
  white: "#F8FAFC",
  gray: "#94A3B8",
  error: "#F87171",
  success: "#34D399",
};

// Shared theme properties
const sharedTheme = {
  radius: { md: 12, lg: 14, xl: 16 },
  space: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 },
  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
  },
};

// Theme creator function
export const createTheme = (isDark: boolean) => ({
  ...sharedTheme,
  colors: isDark ? darkColors : lightColors,
  isDark,
});

// Default light theme (for backward compatibility)
export const theme = createTheme(false);
