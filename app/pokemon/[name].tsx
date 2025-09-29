import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { usePokemonByName } from "../hooks/use-pokemon";
import { useEvolutionChain } from "../hooks/use-evolution";
import { PokemonImage } from "../../components/ui/pokemon-image";
import Favorite from "../../components/ui/favorite";

const { width } = Dimensions.get('window');

type TabType = 'about' | 'stats' | 'evolution';

export default function PokemonDetailScreen() {
  const params = useLocalSearchParams();
  const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
  const [activeTab, setActiveTab] = useState<TabType>('about');
  
  const { data: pokemon, isLoading, error } = usePokemonByName((nameParam || "").toString());
  const { data: evolutionChain, isLoading: evolutionLoading } = useEvolutionChain(pokemon?.id || 0);

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
        <Text style={styles.infoLabel}>Name</Text>
        <Text style={styles.infoValue}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ID</Text>
        <Text style={styles.infoValue}>#{pokemon.id.toString().padStart(3, "0")}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Base Experience</Text>
        <Text style={styles.infoValue}>{pokemon.base_experience || 'Unknown'}</Text>
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
        <Text style={styles.infoLabel}>Types</Text>
        <View style={styles.infoValueContainer}>
          {pokemon.types.map((t, i) => (
            <View key={i} style={[styles.typeBadgeSmall, { backgroundColor: getTypeColor(t.type.name) }]}>
              <Text style={styles.typeTextSmall}>
                {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
              </Text>
            </View>
          ))}
        </View>
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

  const renderEvolutionTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Evolution Chain</Text>
        {evolutionLoading ? (
          <View style={styles.evolutionContainer}>
            <ActivityIndicator size="small" color="#5631E8" />
            <Text style={styles.evolutionNote}>Loading evolution chain...</Text>
          </View>
        ) : evolutionChain && evolutionChain.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.evolutionScroll}>
            {evolutionChain.map((step, index) => (
              <View key={step.id} style={styles.evolutionStep}>
                <View style={styles.evolutionPokemon}>
                  <PokemonImage id={step.id} size={80} />
                  <Text style={styles.evolutionName}>
                    {step.name.charAt(0).toUpperCase() + step.name.slice(1)}
                  </Text>
                  {step.minLevel && (
                    <Text style={styles.evolutionLevel}>Lv. {step.minLevel}</Text>
                  )}
                </View>
                {index < evolutionChain.length - 1 && (
                  <Ionicons name="arrow-forward" size={20} color="#666" style={styles.evolutionArrow} />
                )}
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.evolutionContainer}>
            <Text style={styles.evolutionText}>This Pokémon does not evolve</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about': return renderAboutTab();
      case 'stats': return renderStatsTab();
      case 'evolution': return renderEvolutionTab();
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
          {(['about', 'stats', 'evolution'] as TabType[]).map((tab) => (
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
    minHeight: 300, // Ensure minimum height for content
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
  infoValueContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  typeBadgeSmall: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTextSmall: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
  
  // Evolution
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  evolutionContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  evolutionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  evolutionNote: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  evolutionScroll: {
    paddingVertical: 10,
  },
  evolutionStep: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  evolutionPokemon: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 5,
    minWidth: 100,
  },
  evolutionName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  evolutionLevel: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  evolutionArrow: {
    marginHorizontal: 5,
  },
});
