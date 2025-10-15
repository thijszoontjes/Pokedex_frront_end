import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pokemon } from 'pokenode-ts';

export interface BattlePokemon {
  id: number;
  name: string;
  sprite: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  moves: BattleMove[];
  types: string[];
}

export interface BattleMove {
  name: string;
  power: number;
  accuracy: number;
  type: string;
  pp: number;
  maxPp: number;
  description: string;
}

export interface BattleState {
  playerPokemon: BattlePokemon | null;
  enemyPokemon: BattlePokemon | null;
  currentTurn: 'player' | 'enemy';
  battlePhase: 'selection' | 'battle' | 'victory' | 'defeat';
  battleLog: string[];
  isAnimating: boolean;
}

interface BattleContextType {
  battleState: BattleState;
  initBattle: (playerPokemon: Pokemon, enemyPokemon: Pokemon) => void;
  startBattle: (playerPokemon: Pokemon) => void;
  useMove: (move: BattleMove, attacker: 'player' | 'enemy') => void;
  endBattle: () => void;
  addToLog: (message: string) => void;
  setAnimating: (animating: boolean) => void;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

const initialBattleState: BattleState = {
  playerPokemon: null,
  enemyPokemon: null,
  currentTurn: 'player',
  battlePhase: 'selection',
  battleLog: [],
  isAnimating: false,
};

// Pokemon moves database
const POKEMON_MOVES: Record<string, BattleMove> = {
  tackle: {
    name: 'Tackle',
    power: 40,
    accuracy: 100,
    type: 'normal',
    pp: 35,
    maxPp: 35,
    description: 'A physical attack in which the user charges and slams into the target.',
  },
  'vine-whip': {
    name: 'Vine Whip',
    power: 45,
    accuracy: 100,
    type: 'grass',
    pp: 25,
    maxPp: 25,
    description: 'The target is struck with slender, whiplike vines.',
  },
  ember: {
    name: 'Ember',
    power: 40,
    accuracy: 100,
    type: 'fire',
    pp: 25,
    maxPp: 25,
    description: 'The target is attacked with small flames.',
  },
  'water-gun': {
    name: 'Water Gun',
    power: 40,
    accuracy: 100,
    type: 'water',
    pp: 25,
    maxPp: 25,
    description: 'The target is blasted with a forceful shot of water.',
  },
  scratch: {
    name: 'Scratch',
    power: 40,
    accuracy: 100,
    type: 'normal',
    pp: 35,
    maxPp: 35,
    description: 'Hard, pointed, sharp claws rake the target.',
  },
  thundershock: {
    name: 'Thunder Shock',
    power: 40,
    accuracy: 100,
    type: 'electric',
    pp: 30,
    maxPp: 30,
    description: 'A jolt of electricity crashes down on the target.',
  },
  pound: {
    name: 'Pound',
    power: 40,
    accuracy: 100,
    type: 'normal',
    pp: 35,
    maxPp: 35,
    description: 'The target is physically pounded with a long tail or foreleg.',
  },
  'quick-attack': {
    name: 'Quick Attack',
    power: 40,
    accuracy: 100,
    type: 'normal',
    pp: 30,
    maxPp: 30,
    description: 'The user lunges at the target to inflict damage, moving at blinding speed.',
  },
};

export function BattleProvider({ children }: { children: ReactNode }) {
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);

  const convertToBattlePokemon = (pokemon: Pokemon): BattlePokemon => {
    const level = 50; // Fixed level for battles
    const hpStat = pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 45;
    const attackStat = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 49;
    const defenseStat = pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 49;
    const speedStat = pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 45;

    // Calculate actual stats based on level
    const maxHp = Math.floor(((2 * hpStat + 31) * level) / 100) + level + 10;
    const attack = Math.floor(((2 * attackStat + 31) * level) / 100) + 5;
    const defense = Math.floor(((2 * defenseStat + 31) * level) / 100) + 5;
    const speed = Math.floor(((2 * speedStat + 31) * level) / 100) + 5;

    // Assign moves based on Pokemon type
    const types = pokemon.types.map(t => t.type.name);
    let moves: BattleMove[] = [{ ...POKEMON_MOVES.tackle }]; // Default move

    // Add type-specific moves
    if (types.includes('grass')) moves.push({ ...POKEMON_MOVES['vine-whip'] });
    if (types.includes('fire')) moves.push({ ...POKEMON_MOVES.ember });
    if (types.includes('water')) moves.push({ ...POKEMON_MOVES['water-gun'] });
    if (types.includes('electric')) moves.push({ ...POKEMON_MOVES.thundershock });
    if (types.includes('normal')) moves.push({ ...POKEMON_MOVES['quick-attack'] });

    // Add scratch for pokemon with claws
    if (['charmander', 'charmeleon', 'charizard', 'meowth', 'persian'].includes(pokemon.name)) {
      moves.push({ ...POKEMON_MOVES.scratch });
    }

    // Ensure at least 2 moves
    if (moves.length < 2) {
      moves.push({ ...POKEMON_MOVES.pound });
    }

    // Limit to 4 moves
    moves = moves.slice(0, 4);

    return {
      id: pokemon.id,
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      sprite: pokemon.sprites.front_default || pokemon.sprites.other?.['official-artwork']?.front_default || '',
      maxHp,
      currentHp: maxHp,
      attack,
      defense,
      speed,
      level,
      moves,
      types,
    };
  };

  const initBattle = (playerPokemon: Pokemon, enemyPokemon: Pokemon) => {
    const player = convertToBattlePokemon(playerPokemon);
    const enemy = convertToBattlePokemon(enemyPokemon);

    setBattleState({
      ...initialBattleState,
      playerPokemon: player,
      enemyPokemon: enemy,
      battlePhase: 'battle',
      currentTurn: player.speed >= enemy.speed ? 'player' : 'enemy',
      battleLog: [`${player.name} vs ${enemy.name}!`, 'Battle begins!'],
    });
  };

  const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon, move: BattleMove): number => {
    // Pokemon damage formula (simplified)
    const level = attacker.level;
    const power = move.power;
    const attack = attacker.attack;
    const defense = defender.defense;
    
    // Type effectiveness (simplified)
    let effectiveness = 1;
    const moveType = move.type;
    const defenderTypes = defender.types;
    
    // Basic type effectiveness
    if (moveType === 'water' && defenderTypes.includes('fire')) effectiveness = 2;
    if (moveType === 'fire' && defenderTypes.includes('grass')) effectiveness = 2;
    if (moveType === 'grass' && defenderTypes.includes('water')) effectiveness = 2;
    if (moveType === 'electric' && defenderTypes.includes('water')) effectiveness = 2;
    
    if (moveType === 'water' && defenderTypes.includes('grass')) effectiveness = 0.5;
    if (moveType === 'fire' && defenderTypes.includes('water')) effectiveness = 0.5;
    if (moveType === 'grass' && defenderTypes.includes('fire')) effectiveness = 0.5;
    if (moveType === 'electric' && defenderTypes.includes('ground')) effectiveness = 0;

    // Random factor (85-100%)
    const randomFactor = (Math.random() * 0.15 + 0.85);
    
    const damage = Math.floor(
      ((((2 * level + 10) / 250) * (attack / defense) * power + 2) * effectiveness * randomFactor)
    );
    
    return Math.max(1, damage); // Minimum 1 damage
  };

  const useMove = (move: BattleMove, attacker: 'player' | 'enemy') => {
    setBattleState(prev => {
      if (prev.battlePhase !== 'battle' || prev.isAnimating) return prev;

      const attackerPokemon = attacker === 'player' ? prev.playerPokemon! : prev.enemyPokemon!;
      const defenderPokemon = attacker === 'player' ? prev.enemyPokemon! : prev.playerPokemon!;

      // Check if move hits
      const hitChance = Math.random() * 100;
      if (hitChance > move.accuracy) {
        return {
          ...prev,
          battleLog: [...prev.battleLog, `${attackerPokemon.name} used ${move.name}!`, `${attackerPokemon.name}'s attack missed!`],
          currentTurn: prev.currentTurn === 'player' ? 'enemy' : 'player',
        };
      }

      const damage = calculateDamage(attackerPokemon, defenderPokemon, move);
      const newDefenderHp = Math.max(0, defenderPokemon.currentHp - damage);

      let effectivenessText = '';
      const moveType = move.type;
      const defenderTypes = defenderPokemon.types;
      
      if (moveType === 'water' && defenderTypes.includes('fire')) effectivenessText = "It's super effective!";
      if (moveType === 'fire' && defenderTypes.includes('grass')) effectivenessText = "It's super effective!";
      if (moveType === 'grass' && defenderTypes.includes('water')) effectivenessText = "It's super effective!";
      if (moveType === 'electric' && defenderTypes.includes('water')) effectivenessText = "It's super effective!";
      
      if (moveType === 'water' && defenderTypes.includes('grass')) effectivenessText = "It's not very effective...";
      if (moveType === 'fire' && defenderTypes.includes('water')) effectivenessText = "It's not very effective...";
      if (moveType === 'grass' && defenderTypes.includes('fire')) effectivenessText = "It's not very effective...";

      const newLog = [
        ...prev.battleLog,
        `${attackerPokemon.name} used ${move.name}!`,
        ...(effectivenessText ? [effectivenessText] : []),
      ];

      // Update Pokemon HP
      const updatedPlayerPokemon = attacker === 'enemy' 
        ? { ...prev.playerPokemon!, currentHp: newDefenderHp }
        : prev.playerPokemon!;
      
      const updatedEnemyPokemon = attacker === 'player' 
        ? { ...prev.enemyPokemon!, currentHp: newDefenderHp }
        : prev.enemyPokemon!;

      // Check for battle end
      if (newDefenderHp <= 0) {
        const battlePhase = attacker === 'player' ? 'victory' : 'defeat';
        const winnerName = attacker === 'player' ? attackerPokemon.name : defenderPokemon.name;
        
        return {
          ...prev,
          playerPokemon: updatedPlayerPokemon,
          enemyPokemon: updatedEnemyPokemon,
          battlePhase,
          battleLog: [...newLog, `${defenderPokemon.name} fainted!`, `${winnerName} wins!`],
        };
      }

      return {
        ...prev,
        playerPokemon: updatedPlayerPokemon,
        enemyPokemon: updatedEnemyPokemon,
        battleLog: newLog,
        currentTurn: prev.currentTurn === 'player' ? 'enemy' : 'player',
      };
    });
  };

  const startBattle = (playerPokemon: Pokemon) => {
    // Generate a random enemy Pokemon (different from player)
    const enemyId = Math.floor(Math.random() * 150) + 1;
    const enemyPokemonData: Pokemon = {
      ...playerPokemon,
      id: enemyId,
      name: `wild-pokemon-${enemyId}`,
      sprites: {
        ...playerPokemon.sprites,
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${enemyId}.png`,
      },
    };
    
    initBattle(playerPokemon, enemyPokemonData);
  };

  const endBattle = () => {
    setBattleState(initialBattleState);
  };

  const addToLog = (message: string) => {
    setBattleState(prev => ({
      ...prev,
      battleLog: [...prev.battleLog, message],
    }));
  };

  const setAnimating = (animating: boolean) => {
    setBattleState(prev => ({
      ...prev,
      isAnimating: animating,
    }));
  };

  const value: BattleContextType = {
    battleState,
    initBattle,
    startBattle,
    useMove,
    endBattle,
    addToLog,
    setAnimating,
  };

  return (
    <BattleContext.Provider value={value}>
      {children}
    </BattleContext.Provider>
  );
}

export function useBattle() {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error('useBattle must be used within a BattleProvider');
  }
  return context;
}