import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePokemonByName } from "../hooks/use-pokemon";
import { PokemonImage } from "../../components/ui/pokemon-image";
import Favorite from "../../components/ui/favorite";

export default function PokemonDetailScreen() {
  const params = useLocalSearchParams();
  const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
  
  // Debug logging
  console.log("Pokemon name param:", nameParam);
  console.log("Params object:", params);
  
  const { data: pokemon, isLoading, error } = usePokemonByName((nameParam || "").toString());

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5631E8" />
          <Text style={styles.loadingText}>Loading Pokémon...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !pokemon) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pokémon not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.pokemonName}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>
          <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, "0")}</Text>
          <View style={styles.favoriteContainer}>
            <Favorite 
              pokemonId={pokemon.id} 
              pokemonName={pokemon.name}
              imageUrl={pokemon.sprites.front_default || undefined}
            />
          </View>
        </View>

        <View style={styles.imageContainer}>
          <PokemonImage id={pokemon.id} size={220} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Types</Text>
          <View style={styles.typesContainer}>
            {pokemon.types.map((t, i) => (
              <View key={i} style={styles.typeBadge}>
                <Text style={styles.typeText}>
                  {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff" },
  scrollView: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: "#5631E8" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#666" },
  header: { alignItems: "center", paddingVertical: 20, paddingHorizontal: 16 },
  pokemonName: { fontSize: 32, fontWeight: "bold", color: "#0E0940", textTransform: "capitalize" },
  pokemonId: { fontSize: 18, color: "#666", marginTop: 4 },
  favoriteContainer: { marginTop: 12 },

  imageContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsContainer: { padding: 16, backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#0E0940", marginBottom: 12 },
  typesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeBadge: { backgroundColor: "#5631E8", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  typeText: { color: "#fff", fontWeight: "bold", textTransform: "capitalize" },
});
