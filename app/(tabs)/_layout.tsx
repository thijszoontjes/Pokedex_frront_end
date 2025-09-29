import { Tabs } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

const ACTIVE = "#6E44FF";
const INACTIVE = "#94A3B8";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginTop: 2,
          marginBottom: Platform.OS === "ios" ? -2 : 0,
        },
        // floating "pill" bar
        tabBarStyle: {
          position: "absolute",
        left: 16, 
          right: 16,
          bottom: 12,
          height: 64,
          borderRadius: 20,
          backgroundColor: "#FFFFFFEE",
          borderTopWidth: 0,
          // soft shadow
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 10,
          paddingBottom: Platform.OS === "ios" ? 10 : 8,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      {/* Pokémons tab (jouw Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokémons",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="pokeball"
              size={size ?? 22}
              color={color}
              style={{ opacity: focused ? 1 : 0.9 }}
            />
          ),
        }}
      />

      {/* Favorites tab */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size ?? 22}
              color={color}
              style={{ opacity: focused ? 1 : 0.9 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
