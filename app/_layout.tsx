import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
// let op: pas deze import aan naar relatieve paden als je geen alias gebruikt
import { BattleProvider } from "../constants/BattleContext";
import { ThemeProvider } from "../constants/ThemeContext";
import { useColorScheme } from "../components/useColorScheme";
import { LocalizationProvider } from "../constants/LocalizationContext";
import RubikVariable from "../assets/fonts/Rubik-Variable.ttf";
import RubikItalicVariable from "../assets/fonts/Rubik-Italic-Variable.ttf";
import { databaseService } from "./services/database";
import { applyRubikFontDefaults, rubikFontFamily } from "../constants/fonts";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = { initialRouteName: "(tabs)" };

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
    [rubikFontFamily.regular]: RubikVariable,
    [rubikFontFamily.medium]: RubikVariable,
    [rubikFontFamily.semiBold]: RubikVariable,
    [rubikFontFamily.bold]: RubikVariable,
    [rubikFontFamily.extraBold]: RubikVariable,
    [rubikFontFamily.italic]: RubikItalicVariable,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      applyRubikFontDefaults();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f8ff' }}>
          {/* Loading state instead of null to prevent hook inconsistencies */}
        </View>
      </SafeAreaProvider>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // init database at startup
  useEffect(() => {
    databaseService.initDatabase().catch(() => {
      // Database initialization failed - app will continue with degraded functionality
      // Favorites feature may not work properly
    });
  }, []);

  return (
    <SafeAreaProvider>
      <LocalizationProvider>
        <ThemeProvider>
          <BattleProvider>
            <QueryClientProvider client={queryClient}>
              <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="pokemon/[name]" options={{ headerShown: false }} />
                  <Stack.Screen name="pokemon/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: "modal" }} />
                  <Stack.Screen name="battle" options={{ headerShown: false, presentation: "fullScreenModal" }} />
                  <Stack.Screen name="battle-test" options={{ headerShown: false }} />
                </Stack>
              </NavigationThemeProvider>
            </QueryClientProvider>
          </BattleProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </SafeAreaProvider>
  );
}
