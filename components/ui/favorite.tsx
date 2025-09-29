import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFavorite, useToggleFavorite } from "../../app/hooks/use-favorites";


type Props = { pokemonId: number; pokemonName: string; imageUrl?: string };

export default function Favorite({ pokemonId, pokemonName, imageUrl }: Props) {
  const { data: isFavorited, isLoading } = useIsFavorite(pokemonId);
  const toggle = useToggleFavorite();

  const onToggle = () => {
    if (isLoading) return;
    toggle.mutate({
      pokemonId,
      name: pokemonName,
      imageUrl,
      isCurrentlyFavorite: !!isFavorited,
    });
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={onToggle} disabled={toggle.isPending}>
      <Ionicons
        name={isFavorited ? "heart" : "heart-outline"}
        size={22}
        color={isFavorited ? "#FF6B6B" : "#666"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
