import { ActivityIndicator, StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { theme } from "@/constants/theme";
import SearchBar from "@/components/ui/search-bar";
import PokemonList from "@/components/ui/pokemon-list";
import { usePokemonList } from "../hooks/use-pokemon";
import { useToggleFavorite } from "../hooks/use-favorites";
import { router } from "expo-router";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, error } = usePokemonList(150, 0);
  const toggleFavorite = useToggleFavorite();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!data) return [];
    if (!q) return data;
    return data.filter(p => p.name.toLowerCase().includes(q) || p.id.padStart(3, "0").includes(q));
  }, [data, query]);

  const listData = (filtered ?? []).map(p => ({
    id: Number(p.id),
    name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
  }));

  const handleAddToFavorites = (pokemon: { id: number; name: string; image: string }) => {
    toggleFavorite.mutate({
      pokemonId: pokemon.id,
      name: pokemon.name.toLowerCase(),
      imageUrl: pokemon.image,
      isCurrentlyFavorite: false, // We assume it's not favorited when adding from main list
    });
    
    Alert.alert(
      "Added to Favorites! ❤️",
      `${pokemon.name} has been added to your favorites.`,
      [{ text: "OK" }]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.sub}>Loading Pokémon…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.sub}>
            {error instanceof Error ? error.message : "Failed to load data"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search for Pokémon.." />
      <Text style={styles.title}>All Pokémon</Text>
     <PokemonList
  data={listData}
  onPressItem={(p) => router.push(`/pokemon/${p.id}`)}
  onAddToFavorites={handleAddToFavorites}
/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  title: {
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.xs,
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  sub: { marginTop: 8, color: theme.colors.subtext },
});
