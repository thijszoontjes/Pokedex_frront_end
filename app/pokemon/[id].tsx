import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { usePokemonById } from "../hooks/use-pokemon";
import { PokemonImage } from "../../components/ui/pokemon-image";
import Favorite from "../../components/ui/favorite";

const { width } = Dimensions.get('window');

type TabType = 'about' | 'stats' | 'evolution' | 'moves';

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams();
  const realId = Array.isArray(id) ? id[0] : id;
  const [activeTab, setActiveTab] = useState<TabType>('about');
  
  const { data: pokemon, isLoading, error } = usePokemonById(realId || "");

  // Helper functions defined here so they're always available
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
      grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
      ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
      rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
      steel: '#B8B8D0', fairy: '#EE99AC'
    };
    return colors[type] || '#68A090';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5631E8" />
          <Text style={styles.loadingText}>Loading Pokémon...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !pokemon) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pokémon not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Species</Text>
        <Text style={styles.infoValue}>{pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Height</Text>
        <Text style={styles.infoValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Weight</Text>
        <Text style={styles.infoValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Abilities</Text>
        <Text style={styles.infoValue}>
          {pokemon.abilities.map(a => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)).join(', ')}
        </Text>
      </View>
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      {pokemon.stats.map((stat, index) => (
        <View key={index} style={styles.statRow}>
          <Text style={styles.statName}>
            {stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1).replace('-', ' ')}
          </Text>
          <Text style={styles.statValue}>{stat.base_stat}</Text>
          <View style={styles.statBarContainer}>
            <View style={[styles.statBar, { width: `${(stat.base_stat / 150) * 100}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderEvolutionTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.comingSoon}>Evolution chain coming soon...</Text>
    </View>
  );

  const renderMovesTab = () => (
    <View style={styles.tabContent}>
      {pokemon.moves.slice(0, 10).map((move, index) => (
        <View key={index} style={styles.moveItem}>
          <Text style={styles.moveName}>
            {move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1).replace('-', ' ')}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about': return renderAboutTab();
      case 'stats': return renderStatsTab();
      case 'evolution': return renderEvolutionTab();
      case 'moves': return renderMovesTab();
      default: return renderAboutTab();
    }
  };

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(primaryType);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with background color based on Pokemon type */}
      <View style={[styles.headerSection, { backgroundColor: typeColor }]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.favoriteContainer}>
            <Favorite 
              pokemonId={pokemon.id} 
              pokemonName={pokemon.name}
              imageUrl={pokemon.sprites.front_default || undefined}
            />
          </View>
        </View>
        
        <View style={styles.pokemonHeader}>
          <Text style={styles.pokemonName}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>
          <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, "0")}</Text>
        </View>

        <View style={styles.typesContainer}>
          {pokemon.types.map((t, i) => (
            <View key={i} style={[styles.typeBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.typeText}>
                {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.imageContainer}>
          <PokemonImage id={pokemon.id} size={200} />
        </View>
      </View>

      {/* White content area with tabs */}
      <View style={styles.contentSection}>
        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {(['about', 'stats', 'evolution', 'moves'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.tabContentContainer} showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: "#5631E8" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#666" },
  
  // Header Section (colored background)
  headerSection: {
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  favoriteContainer: {
    alignSelf: "flex-end",
  },
  pokemonHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  pokemonId: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  typesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
    fontSize: 14,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
  },

  // Content Section (white background)
  contentSection: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  
  // Tab Navigation
  tabNavigation: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#5631E8",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#5631E8",
    fontWeight: "bold",
  },
  
  // Tab Content
  tabContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingBottom: 30,
  },
  
  // About Tab
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  
  // Stats Tab
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 10,
  },
  statName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    width: 80,
    textTransform: "capitalize",
  },
  statValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    width: 40,
    textAlign: "right",
    marginRight: 10,
  },
  statBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    backgroundColor: "#5631E8",
    borderRadius: 3,
  },
  
  // Evolution & Moves
  comingSoon: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 50,
  },
  moveItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 8,
  },
  moveName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
