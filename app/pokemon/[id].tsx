import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePokemonById } from "../hooks/use-pokemon";
import { PokemonImage } from "../../components/ui/pokemon-image";
import Favorite from "../../components/ui/favorite";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams();
  const realId = Array.isArray(id) ? id[0] : id;
  const { data: pokemon, isLoading, error } = usePokemonById(realId || "");

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}><ActivityIndicator size="large" /><Text>Loading…</Text></View>
      </SafeAreaView>
    );
  } 

  if (error || !pokemon) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}><Text style={{ color: "red" }}>Pokémon not found</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0E0940" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
          <Text style={styles.sub}>#{String(pokemon.id).padStart(3, "0")}</Text>
          <View style={styles.favoriteContainer}>
            <Favorite 
              pokemonId={pokemon.id} 
              pokemonName={pokemon.name}
              imageUrl={pokemon.sprites.front_default || undefined}
            />
          </View>
        </View>
        <View style={styles.imageWrap}>
          <PokemonImage id={pokemon.id} size={220} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 8, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.9)" },
  header: { alignItems: "center", paddingVertical: 20 },
  name: { fontSize: 32, fontWeight: "bold", color: "#0E0940" },
  sub: { color: "#666", marginTop: 4, fontSize: 16 },
  favoriteContainer: { marginTop: 12 },
  imageWrap: { backgroundColor: "#fff", margin: 16, borderRadius: 12, alignItems: "center", paddingVertical: 20 },
});
