import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useTheme } from "@/constants/ThemeContext";
import PokeCard from "./poke-card";
import { PokemonWithId } from "../../app/hooks/use-pokemon";
import { rubikFontFamily } from "@/constants/fonts";

type Item = { id: number; name: string; image: string };

type Props = {
  data: PokemonWithId[][];
  onPressItem?: (item: Item) => void;
  onAddToFavorites?: (item: Item) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  searchQuery?: string;
};

export default function InfinitePokemonList({
  data,
  onPressItem,
  onAddToFavorites,
  onLoadMore,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  searchQuery,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Flatten all pages into single array
  const allPokemon = useMemo(() => {
    return data?.flatMap(page => page) || [];
  }, [data]);

  // Filter based on search query
  const filteredPokemon = useMemo(() => {
    if (!searchQuery?.trim()) return allPokemon;
    const q = searchQuery.trim().toLowerCase();
    return allPokemon.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.id.padStart(3, "0").includes(q)
    );
  }, [allPokemon, searchQuery]);

  // Transform to the format expected by PokeCard
  const listData = useMemo(() => {
    return filteredPokemon.map(p => ({
      id: Number(p.id),
      name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
    }));
  }, [filteredPokemon]);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <PokeCard
        id={item.id}
        name={item.name}
        imageUri={item.image}
        onPress={() => onPressItem?.(item)}
        onAddToFavorites={() => onAddToFavorites?.(item)}
      />
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.footerText, { color: theme.colors.subtext }]}>
          Loading more Pokémon...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No Pokémon found
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.subtext }]}>
          {searchQuery ? `No results for "${searchQuery}"` : "No Pokémon available"}
        </Text>
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage && !searchQuery) {
      onLoadMore?.();
    }
  };

  return (
    <FlatList
      data={listData}
      numColumns={2}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.row}
      ItemSeparatorComponent={() => <View style={{ height: theme.space.lg }} />}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
      
      // Infinite scroll props
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3} // Trigger when 30% from bottom
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
    />
  );
}

const createStyles = (theme: ReturnType<typeof import('../../constants/theme').createTheme>) => StyleSheet.create({
  content: {
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.xl + 80, // Extra space for tab bar
  },
  row: { 
    gap: theme.space.lg 
  },
  item: { 
    flex: 1 
  },
  footer: {
    paddingVertical: theme.space.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: theme.space.sm,
    fontSize: 14,
    fontFamily: rubikFontFamily.medium,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.space.xl * 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: rubikFontFamily.bold,
    marginBottom: theme.space.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
