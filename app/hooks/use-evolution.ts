import { useQuery } from "@tanstack/react-query";
import { PokeApiService } from "../services/pokemon-api";

export interface EvolutionChainStep {
  id: number;
  name: string;
  minLevel?: number;
  trigger?: string;
  item?: string;
}

interface EvolutionDetail {
  min_level: number | null;
  trigger: {
    name: string;
  };
  item?: {
    name: string;
  };
}

interface ChainLink {
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
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
        const parseEvolutionChain = (chainLink: ChainLink, steps: EvolutionChainStep[] = []): EvolutionChainStep[] => {
          // Add current Pokemon if not already in the array
          const pokemonId = chainLink.species.url.split('/').slice(-2, -1)[0];
          const currentId = Number(pokemonId);
          
          if (!steps.find(step => step.id === currentId)) {
            steps.push({
              id: currentId,
              name: chainLink.species.name,
            });
          }
          
          // Add evolved forms
          chainLink.evolves_to.forEach((evolution: ChainLink) => {
            const evolutionDetails = evolution.evolution_details[0];
            const evolvedPokemonId = evolution.species.url.split('/').slice(-2, -1)[0];
            const evolvedId = Number(evolvedPokemonId);
            
            // Only add if not already in the array
            if (!steps.find(step => step.id === evolvedId)) {
              steps.push({
                id: evolvedId,
                name: evolution.species.name,
                minLevel: evolutionDetails?.min_level || undefined,
                trigger: evolutionDetails?.trigger?.name || undefined,
                item: evolutionDetails?.item?.name || undefined,
              });
            }
            
            // Recursively add further evolutions
            if (evolution.evolves_to.length > 0) {
              parseEvolutionChain(evolution, steps);
            }
          });
          
          return steps;
        };
        
        const result = parseEvolutionChain(evolutionChain.chain);
        
        // Final deduplication to ensure no duplicates
        const uniqueEvolutions = result.filter((pokemon, index, array) => 
          array.findIndex(p => p.id === pokemon.id) === index
        );
        
        return uniqueEvolutions;
      } catch (error) {
        // Error fetching evolution chain
        return [];
      }
    },
    enabled: !!speciesId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });