import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePokemonById } from "../hooks/use-pokemon";
import { PokemonImage } from "../../components/ui/pokemon-image";

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
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.sub}>#{String(pokemon.id).padStart(3, "0")}</Text>
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
  header: { alignItems: "center", paddingVertical: 20 },
  name: { fontSize: 32, fontWeight: "bold", textTransform: "capitalize" },
  sub: { color: "#666", marginTop: 4 },
  imageWrap: { backgroundColor: "#fff", margin: 16, borderRadius: 12, alignItems: "center", paddingVertical: 20 },
});
