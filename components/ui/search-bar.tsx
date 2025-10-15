import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@/constants/ThemeContext";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, placeholder }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
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

const createStyles = (theme: ReturnType<typeof import('../../constants/theme').createTheme>) => StyleSheet.create({
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
