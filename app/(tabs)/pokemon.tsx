import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image, // 👈 toevoegen
} from "react-native";
import { pokemonData, Pokemon } from "@/constants/pokemon";

export default function PokemonScreen() {
  function onPressCard(p: Pokemon) {
    Alert.alert("Gotcha!", `You caught ${p.name}!`);
  }

  function renderItem({ item }: { item: Pokemon }) {
    const id = String(item.id).padStart(3, "0");
    return (
      <Pressable
        onPress={() => onPressCard(item)}
        style={styles.pokemonCard}
        android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
      >
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{id}</Text>
        </View>

        {/* 👇 plaatje toevoegen */}
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.cardTextArea}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokémon</Text>
      </View>

      <FlatList
        data={pokemonData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const PURPLE = "#7C3AED";
const CARD_BG = "#FFFFFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDE00",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1b1b1b",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  pokemonCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    position: "relative",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  idBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: PURPLE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 2,
  },
  idText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardTextArea: {
    gap: 2,
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  type: {
    fontSize: 14,
    color: "#4B5563",
  },
});
