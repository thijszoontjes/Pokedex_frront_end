import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { NamedAPIResource } from "pokenode-ts";
import { PokeApiService } from "../services/pokemon-api";

export type PokemonWithId = NamedAPIResource & { id: string };

export function getPokemonIdFromUrl(url: string): string | null {
  if (!url) return null;
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? m[1] : null;
}

const withId = (r: NamedAPIResource): PokemonWithId => {
  const id = getPokemonIdFromUrl(r.url) || "";
  return { id, ...r };
};

export const usePokemonList = (limit = 20, offset = 0) =>
  useQuery({
    queryKey: ["pokemon-list", limit, offset],
    queryFn: async () => {
      const res = await PokeApiService.listPokemons(offset, limit);
      return res.results.map(withId);
    },
    staleTime: 10 * 60 * 1000,
  });

export const usePokemonByName = (name: string) =>
  useQuery({
    queryKey: ["pokemon-by-name", name?.toLowerCase()],
    queryFn: () => PokeApiService.getPokemonByName(name.toLowerCase()),
    enabled: !!name,
    staleTime: 10 * 60 * 1000,
  });

export const usePokemonById = (id: number | string) =>
  useQuery({
    queryKey: ["pokemon-by-id", String(id)],
    queryFn: () => PokeApiService.getPokemonById(Number(id)),
    enabled: id !== undefined && id !== null && String(id).length > 0,
    staleTime: 10 * 60 * 1000,
  });

// Infinite scroll hook for paginated Pokemon loading
export const useInfinitePokemons = (pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: ["infinite-pokemon-list", pageSize],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await PokeApiService.listPokemons(pageParam, pageSize);
      return {
        results: res.results.map(withId),
        nextOffset: pageParam + pageSize,
        hasMore: res.next !== null, // PokeAPI returns null when no more results
        total: res.count,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000,
  });
};
