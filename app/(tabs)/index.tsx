import { ActivityIndicator, StyleSheet, Text, View, Alert, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { useTheme } from "@/constants/ThemeContext";
import { useLocalization } from "@/constants/LocalizationContext";
import SearchBar from "@/components/ui/search-bar";
import InfinitePokemonList from "../../components/ui/infinite-pokemon-list";
import { useInfinitePokemons } from "../hooks/use-pokemon";
import { useToggleFavorite } from "../hooks/use-favorites";
import { router } from "expo-router";
import AnimatedLoading from "../../components/ui/animated-loading";
import { useFadeIn, useSlideIn } from "../../constants/AnimationHooks";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useLocalization();
  const styles = createStyles(theme);
  const [query, setQuery] = useState("");

  // Animation hooks
  const fadeAnimation = useFadeIn(600);
  const slideAnimation = useSlideIn('up', 800, 200);
  
  // Use infinite query instead of regular query
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemons(20); // Load 20 Pokemon per page

  const toggleFavorite = useToggleFavorite();

  const handleAddToFavorites = (pokemon: { id: number; name: string; image: string }) => {
    toggleFavorite.mutate({
      pokemonId: pokemon.id,
      name: pokemon.name.toLowerCase(),
      imageUrl: pokemon.image,
      isCurrentlyFavorite: false,
    });
    
    Alert.alert(
      t('favorites.added'),
      `${pokemon.name} has been added to your favorites.`,
      [{ text: t('common.ok') }]
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <AnimatedLoading 
          type="pokeball" 
          message={t('home.loading')}
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>{t('home.error')}</Text>
          <Text style={styles.sub}>
            {error instanceof Error ? error.message : t('home.errorMessage')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get total count for display
  const totalLoaded = data?.pages?.reduce((total, page) => total + page.results.length, 0) || 0;
  const totalCount = data?.pages?.[0]?.total || 1000; // Fallback to known Pokemon count

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={fadeAnimation}>
        <SearchBar value={query} onChangeText={setQuery} placeholder={t('home.search.placeholder')} />
      </Animated.View>
      
      <Animated.View style={[styles.titleContainer, slideAnimation]}>
        <Text style={styles.title}>{t('home.title')}</Text>
        {!query && (
          <Text style={styles.subtitle}>
            {totalLoaded} of {totalCount} {t('home.loaded')}
          </Text>
        )}
      </Animated.View>
      
      {/* Battle Test Button */}
      {/* <View style={styles.battleTestContainer}>
        <TouchableOpacity 
          style={styles.battleTestButton}
          onPress={() => router.push('/battle-test')}
        >
          <Text style={styles.battleTestText}>{t('home.battleTest')}</Text>
        </TouchableOpacity>
      </View> */}
      
      <InfinitePokemonList
        data={data?.pages?.map(page => page.results) || []}
        onPressItem={(p: { id: number; name: string; image: string }) => router.push(`/pokemon/${p.id}`)}
        onAddToFavorites={handleAddToFavorites}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        searchQuery={query}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  titleContainer: {
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginTop: 4,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  sub: { marginTop: 8, color: theme.colors.subtext },
  battleTestContainer: {
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.xs,
  },
  battleTestButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  battleTestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
