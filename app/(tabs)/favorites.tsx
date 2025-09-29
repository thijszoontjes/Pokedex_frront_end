// app/(tabs)/favorites.tsx
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import PokemonList from "@/components/ui/pokemon-list";
import { pokemonData } from "@/constants/pokemon";

export default function FavoritesScreen() {
  const favBase = pokemonData.filter((p: any) => p.isFavorite === true);

  const listData = favBase.map((p) => ({
    id: p.id,
    name: p.name,
    image:
      p.image ??
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
  }));

  const isEmpty = listData.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Favorites</Text>

      {isEmpty ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySub}>
            Tap the heart on a Pokémon to add it here.
          </Text>
        </View>
      ) : (
        <PokemonList data={listData} />
      )}
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
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.space.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: theme.colors.subtext,
    textAlign: "center",
  },
});
