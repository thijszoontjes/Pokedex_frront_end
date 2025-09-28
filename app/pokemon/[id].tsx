import { useLocalSearchParams, useRouter } from "expo-router";
import { pokemonData } from "@/constants/pokemon";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const pokemon = pokemonData.find((p) => String(p.id) === id);

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Pokémon not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const formattedId = String(pokemon.id).padStart(3, "0");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {pokemon.name} #{formattedId}
      </Text>
      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{pokemon.type}</Text>
      </View>

      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const PURPLE = "#7C3AED";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDE00",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  typeBadge: {
    backgroundColor: PURPLE,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 20,
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    fontSize: 18,
    color: "red",
    marginBottom: 16,
  },
  backBtn: {
    marginTop: 12,
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontWeight: "600",
  },
});
