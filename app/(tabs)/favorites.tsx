import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import PokemonList from "@/components/ui/pokemon-list";
import SearchBar from "@/components/ui/search-bar";
import { pokemonData } from "@/constants/pokemon";

export default function FavoritesScreen() {
  const favoritesBase = pokemonData.slice(0, 2);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return favoritesBase;
    return favoritesBase.filter(p =>
      p.name.toLowerCase().includes(q) ||
      String(p.id).padStart(3, "0").includes(q) ||
      p.type.toLowerCase().includes(q)
    );
  }, [query]);

  const header = (
    <>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search favorites…" />
      <></>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PokemonList data={filtered} header={header} title="Favorites" emptyText="No favorites match your search." />
    </SafeAreaView>
  );
}
