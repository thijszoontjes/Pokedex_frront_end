import { View, TextInput, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? "Search for Pokémon.."}
        placeholderTextColor={theme.colors.subtext}
        style={styles.input}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.lg },
  input: {
    height: 46,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.space.md,
    backgroundColor: theme.colors.panel,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
});
