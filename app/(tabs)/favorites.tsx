import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "../hooks/use-favorites";
import PokeCard from "../../components/ui/poke-card";
import { router } from "expo-router";


export default function FavoritesScreen() {
  const { data: favorites, isLoading, error } = useFavorites();

  const renderItem = ({ item }: { item: { id: number; name: string; image_url: string } }) => (
    <PokeCard
      id={item.id}
      name={item.name}
      imageUri={item.image_url}
      onPress={() => router.push(`/pokemon/${item.name.toLowerCase()}`)} // detail by name
    />
  );

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
      <FlatList
        data={favorites}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff" },
  header: { paddingHorizontal: 16, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0E0940" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 4 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  empty: { fontSize: 18, fontWeight: "700", color: "#666", marginBottom: 8, textAlign: "center" },
  sub: { fontSize: 15, color: "#999", textAlign: "center" },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
});
