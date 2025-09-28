import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Pokemon } from "@/constants/pokemon";

type PokemonListProps = {
  data: Pokemon[];
  title?: string;
  header?: React.ReactNode;
  emptyText?: string;
};

export default function PokemonList({ data, title, header, emptyText = "No Pokémon found." }: PokemonListProps) {
  const router = useRouter();

  function renderItem({ item }: { item: Pokemon }) {
    const id = String(item.id).padStart(3, "0");
    return (
      <Pressable
        onPress={() => router.push(`/pokemon/${item.id}`)}
        style={styles.card}
        android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      >
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{id}</Text>
        </View>
        <View style={styles.bgSection} />
        <Text style={styles.name}>{item.name}</Text>
      </Pressable>
    );
  }

  function ListHeader() {
    if (header) return <View>{header}</View>;
    if (title) return <Text style={styles.title}>{title}</Text>;
    return null;
  }

  function ListEmpty() {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const PURPLE = "#7C3AED";
const LIGHT_PURPLE = "#F3E8FF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDE00",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1b1b1b",
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  idBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: PURPLE,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    zIndex: 2,
  },
  idText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  bgSection: {
    backgroundColor: LIGHT_PURPLE,
    borderRadius: 12,
    aspectRatio: 1.6,
    width: "100%",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  emptyWrap: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
});
