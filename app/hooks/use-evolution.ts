import { useQuery } from "@tanstack/react-query";
import { PokeApiService } from "../services/pokemon-api";

export interface EvolutionChainStep {
  id: number;
  name: string;
  minLevel?: number;
  trigger?: string;
  item?: string;
}

export const useEvolutionChain = (speciesId: number) =>
  useQuery({
    queryKey: ["evolution-chain", speciesId],
    queryFn: async () => {
      try {
        // First get the species to get evolution chain URL
        const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}/`)
          .then(res => res.json());
        
        if (!species.evolution_chain?.url) {
          return [];
        }

        // Extract evolution chain ID from URL
        const evolutionChainId = species.evolution_chain.url.split('/').slice(-2, -1)[0];
        
        // Get the evolution chain
        const evolutionChain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}/`)
          .then(res => res.json());
        
        // Parse the evolution chain into a flat array
        const parseEvolutionChain = (chainLink: any): EvolutionChainStep[] => {
          const steps: EvolutionChainStep[] = [];
          
          // Add current Pokemon
          const pokemonId = chainLink.species.url.split('/').slice(-2, -1)[0];
          steps.push({
            id: Number(pokemonId),
            name: chainLink.species.name,
          });
          
          // Add evolved forms
          chainLink.evolves_to.forEach((evolution: any) => {
            const evolutionDetails = evolution.evolution_details[0];
            const evolvedPokemonId = evolution.species.url.split('/').slice(-2, -1)[0];
            
            steps.push({
              id: Number(evolvedPokemonId),
              name: evolution.species.name,
              minLevel: evolutionDetails?.min_level || undefined,
              trigger: evolutionDetails?.trigger?.name || undefined,
              item: evolutionDetails?.item?.name || undefined,
            });
            
            // Recursively add further evolutions
            if (evolution.evolves_to.length > 0) {
              steps.push(...parseEvolutionChain(evolution));
            }
          });
          
          return steps;
        };
        
        return parseEvolutionChain(evolutionChain.chain);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
        return [];
      }
    },
    enabled: !!speciesId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });