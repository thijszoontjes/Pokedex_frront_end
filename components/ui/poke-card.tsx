import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

type Props = {
  id: number;
  name: string;
  imageUri: string;
  onPress?: () => void;
};

export default function PokeCard({ id, name, imageUri, onPress }: Props) {
  const label = String(id).padStart(3, "0");

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>

      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.bottom}>
        <Text numberOfLines={1} style={styles.name}>{name}</Text>
        <Text style={styles.dots}>⋮</Text>
      </View>
    </Pressable>
  );
}

const CARD_PAD = 12;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.panel,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: CARD_PAD,
    ...theme.shadow.card,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: theme.colors.badgeBg,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  badgeText: { color: theme.colors.badgeText, fontSize: 11, fontWeight: "700" },
  imageWrap: { alignItems: "center", justifyContent: "center", height: 120, marginTop: 6, marginBottom: 8 },
  image: { width: "82%", height: "100%" },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  name: { color: theme.colors.text, fontSize: 15, fontWeight: "700", flex: 1, marginRight: 8 },
  dots: { color: theme.colors.subtext, fontSize: 18 },
});
