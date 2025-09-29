import { SafeAreaView, StyleSheet, Text } from "react-native";
import { theme } from "@/constants/theme";
import PokemonList from "@/components/ui/pokemon-list";
import { pokemonData } from "@/constants/pokemon";

export default function FavoritesScreen() {
  const favBase = pokemonData.filter(p => (p as any).isFavorite === true);

  const listData = favBase.map(p => ({
    id: p.id,
    name: p.name,
    image: p.image ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Favorites</Text>
      <PokemonList data={listData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  title: {
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.lg,
    paddingBottom: theme.space.xs,
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
});
