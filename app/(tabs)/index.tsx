import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useMemo, useState } from "react";
import { theme } from "@/constants/theme";
import SearchBar from "@/components/ui/search-bar";
import PokemonList from "@/components/ui/pokemon-list";
import { pokemonData } from "@/constants/pokemon";

export default function HomeScreen() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pokemonData;
    return pokemonData.filter(p =>
      p.name.toLowerCase().includes(q) ||
      String(p.id).padStart(3, "0").includes(q) ||
      (p.type ?? "").toLowerCase().includes(q)
    );
  }, [query]);

  const listData = filtered.map(p => ({
    id: p.id,
    name: p.name,
    image: p.image ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search for Pokémon.." />
      <Text style={styles.title}>All Pokémon</Text>
      <PokemonList data={listData} />
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
});
