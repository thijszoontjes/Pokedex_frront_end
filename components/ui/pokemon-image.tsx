import { Image, StyleSheet, View } from "react-native";

type Props = { id: string | number; size?: number };

export function PokemonImage({ id, size = 200 }: Props) {
  const uri = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
});
