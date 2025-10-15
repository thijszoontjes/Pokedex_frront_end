import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "../hooks/use-favorites";
import PokemonList from "../../components/ui/pokemon-list";
import { router } from "expo-router";
import { useTheme } from "@/constants/ThemeContext";


export default function FavoritesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { data: favorites, isLoading, error } = useFavorites();

  // Transform favorites data to match PokemonList expected format
  const listData = (favorites || []).map(fav => ({
    id: fav.id,
    name: fav.name.charAt(0).toUpperCase() + fav.name.slice(1),
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${fav.id}.png`,
  }));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><Text style={styles.title}>My Favorites</Text></View>
        <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading favorites…</Text></View>
      </SafeAreaView>
    );
  }

  if (error || !favorites || favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><Text style={styles.title}>My Favorites</Text></View>
        <View style={styles.center}>
          <Text style={styles.empty}>No favorites yet</Text>
          <Text style={styles.sub}>Tap the heart on any Pokémon to save it.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
        <Text style={styles.subtitle}>{favorites.length} saved</Text>
      </View>
      <PokemonList
        data={listData}
        onPressItem={(item) => router.push(`/pokemon/${item.id}`)}
        onAddToFavorites={(item) => {
          // This would actually remove from favorites since it's already a favorite
          console.log("Pokemon is already in favorites:", item.name);
        }}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: { 
    paddingHorizontal: theme.space.lg, 
    paddingTop: theme.space.md,
    paddingBottom: theme.space.xs,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: theme.colors.text 
  },
  subtitle: { 
    fontSize: 16, 
    color: theme.colors.subtext, 
    marginTop: 4 
  },
  center: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: theme.space.xl 
  },
  empty: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: theme.colors.subtext, 
    marginBottom: 8, 
    textAlign: "center" 
  },
  sub: { 
    fontSize: 15, 
    color: theme.colors.subtext, 
    textAlign: "center" 
  },
});
