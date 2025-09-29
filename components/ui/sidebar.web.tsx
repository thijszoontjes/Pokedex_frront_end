import { View, Text, StyleSheet, Image } from "react-native";

export default function Sidebar() {
  return (
    <View style={styles.sidebar}>
      <View style={styles.logoWrap}>
        <Image
          source={{ uri: "https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.nav}>
       
        <Text style={styles.link}>Pokédex</Text>
        <Text style={styles.link}>Favorites</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Pokédex App ©2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: "#fff",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: "#eee",
    justifyContent: "space-between",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 160,
    height: 60,
  },
  nav: {
    flex: 1,
    gap: 16,
  },
  link: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginVertical: 4,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
  },
});
