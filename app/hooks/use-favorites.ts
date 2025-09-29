import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { databaseService } from "../services/database";

export const useFavorites = () =>
  useQuery({
    queryKey: ["favorites"],
    queryFn: () => databaseService.getAllFavorites(),
    staleTime: 0,
  });

export const useIsFavorite = (pokemonId: number) =>
  useQuery({
    queryKey: ["is-favorite", pokemonId],
    queryFn: () => databaseService.isFavorite(pokemonId),
    staleTime: 0,
  });

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      pokemonId: number;
      name: string;
      imageUrl?: string;
      isCurrentlyFavorite: boolean;
    }) => {
      if (p.isCurrentlyFavorite) {
        await databaseService.removeFavorite(p.pokemonId);
      } else {
        await databaseService.addFavorite(p.pokemonId, p.name, p.imageUrl);
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
      qc.invalidateQueries({ queryKey: ["is-favorite", vars.pokemonId] });
    },
  });
};
