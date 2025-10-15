import { View, FlatList, StyleSheet } from "react-native";
import PokeCard from "./poke-card";
import { theme } from "@/constants/theme";

type Item = { id: number; name: string; image: string };
type Props = {
  data: Item[];
  onPressItem?: (item: Item) => void;
  onAddToFavorites?: (item: Item) => void;
};

export default function PokemonList({ data, onPressItem, onAddToFavorites }: Props) {
  return (
    <FlatList
      data={data}
      key={2}
      numColumns={2}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.row}
      ItemSeparatorComponent={() => <View style={{ height: theme.space.lg }} />}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <PokeCard
            id={item.id}
            name={item.name}
            imageUri={item.image}
            onPress={() => onPressItem?.(item)}
            onAddToFavorites={() => onAddToFavorites?.(item)}
          />
        </View>
      )}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.xl,
  },
  row: { gap: theme.space.lg },
  item: { flex: 1 },
});
