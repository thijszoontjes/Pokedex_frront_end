import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBattle, BattleMove } from '../constants/BattleContext';
import { useTheme } from '../constants/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function BattleScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { battleState, useMove, endBattle } = useBattle();
  
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [flashAnimation] = useState(new Animated.Value(0));

  const { playerPokemon, enemyPokemon, currentTurn, battlePhase, battleLog, isAnimating } = battleState;

  // Auto enemy turn
  useEffect(() => {
    if (currentTurn === 'enemy' && battlePhase === 'battle' && enemyPokemon && !isAnimating) {
      const timer = setTimeout(() => {
        // Enemy AI: pick random move
        const availableMoves = enemyPokemon.moves.filter(move => move.pp > 0);
        if (availableMoves.length > 0) {
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          useMove(randomMove, 'enemy');
          triggerAttackAnimation();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentTurn, battlePhase, enemyPokemon, isAnimating]);

  const triggerAttackAnimation = () => {
    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Flash animation
    Animated.sequence([
      Animated.timing(flashAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePlayerMove = (move: BattleMove) => {
    if (currentTurn === 'player' && battlePhase === 'battle' && !isAnimating) {
      useMove(move, 'player');
      triggerAttackAnimation();
    }
  };

  const handleEndBattle = () => {
    endBattle();
    router.back();
  };

  if (!playerPokemon || !enemyPokemon) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Battle data not found
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#87CEEB' }]}>
      {/* Battle Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleEndBattle}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Battle Arena</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Battle Field */}
      <View style={styles.battleField}>
        {/* Enemy Pokemon */}
        <View style={styles.enemySection}>
          <View style={[styles.pokemonInfo, styles.enemyInfo]}>
            <Text style={styles.pokemonName}>{enemyPokemon.name}</Text>
            <Text style={styles.pokemonLevel}>Lv.{enemyPokemon.level}</Text>
            <View style={styles.hpBar}>
              <View style={styles.hpBarBg}>
                <View 
                  style={[
                    styles.hpBarFill, 
                    { 
                      width: `${(enemyPokemon.currentHp / enemyPokemon.maxHp) * 100}%`,
                      backgroundColor: enemyPokemon.currentHp / enemyPokemon.maxHp > 0.5 ? '#4CAF50' : 
                                     enemyPokemon.currentHp / enemyPokemon.maxHp > 0.2 ? '#FF9800' : '#F44336'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.hpText}>
                {enemyPokemon.currentHp}/{enemyPokemon.maxHp}
              </Text>
            </View>
          </View>
          
          <Animated.View style={[
            styles.pokemonContainer,
            {
              transform: [
                { translateX: currentTurn === 'player' ? shakeAnimation : 0 },
                { scaleX: -1 }, // Flip enemy sprite
              ]
            }
          ]}>
            <Animated.View style={{ opacity: flashAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.3],
            })}}>
              <Image source={{ uri: enemyPokemon.sprite }} style={styles.pokemonSprite} />
            </Animated.View>
          </Animated.View>
        </View>

        {/* Player Pokemon */}
        <View style={styles.playerSection}>
          <Animated.View style={[
            styles.pokemonContainer,
            {
              transform: [
                { translateX: currentTurn === 'enemy' ? shakeAnimation : 0 }
              ]
            }
          ]}>
            <Animated.View style={{ opacity: flashAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.3],
            })}}>
              <Image source={{ uri: playerPokemon.sprite }} style={styles.pokemonSprite} />
            </Animated.View>
          </Animated.View>
          
          <View style={[styles.pokemonInfo, styles.playerInfo]}>
            <Text style={styles.pokemonName}>{playerPokemon.name}</Text>
            <Text style={styles.pokemonLevel}>Lv.{playerPokemon.level}</Text>
            <View style={styles.hpBar}>
              <View style={styles.hpBarBg}>
                <View 
                  style={[
                    styles.hpBarFill, 
                    { 
                      width: `${(playerPokemon.currentHp / playerPokemon.maxHp) * 100}%`,
                      backgroundColor: playerPokemon.currentHp / playerPokemon.maxHp > 0.5 ? '#4CAF50' : 
                                     playerPokemon.currentHp / playerPokemon.maxHp > 0.2 ? '#FF9800' : '#F44336'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.hpText}>
                {playerPokemon.currentHp}/{playerPokemon.maxHp}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Battle Interface */}
      <View style={[styles.battleInterface, { backgroundColor: theme.colors.panel }]}>
        {battlePhase === 'battle' && (
          <>
            {/* Turn Indicator */}
            <View style={styles.turnIndicator}>
              <Text style={[styles.turnText, { color: theme.colors.text }]}>
                {currentTurn === 'player' ? "Your Turn!" : "Enemy's Turn..."}
              </Text>
            </View>

            {/* Player Moves */}
            {currentTurn === 'player' && (
              <View style={styles.movesContainer}>
                <Text style={[styles.movesTitle, { color: theme.colors.text }]}>Choose a move:</Text>
                <View style={styles.movesGrid}>
                  {playerPokemon.moves.map((move, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.moveButton,
                        { 
                          backgroundColor: theme.colors.bg,
                          borderColor: theme.colors.border,
                          opacity: move.pp > 0 ? 1 : 0.5
                        }
                      ]}
                      onPress={() => handlePlayerMove(move)}
                      disabled={move.pp <= 0 || isAnimating}
                    >
                      <Text style={[styles.moveName, { color: theme.colors.text }]}>
                        {move.name}
                      </Text>
                      <Text style={[styles.moveDetails, { color: theme.colors.subtext }]}>
                        {move.type.toUpperCase()} • {move.power} PWR
                      </Text>
                      <Text style={[styles.movePP, { color: theme.colors.subtext }]}>
                        PP: {move.pp}/{move.maxPp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Battle Result */}
        {(battlePhase === 'victory' || battlePhase === 'defeat') && (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultTitle, { 
              color: battlePhase === 'victory' ? '#4CAF50' : '#F44336' 
            }]}>
              {battlePhase === 'victory' ? '🎉 Victory!' : '💀 Defeat!'}
            </Text>
            <Text style={[styles.resultText, { color: theme.colors.text }]}>
              {battlePhase === 'victory' 
                ? `${playerPokemon.name} defeated ${enemyPokemon.name}!`
                : `${enemyPokemon.name} defeated ${playerPokemon.name}!`
              }
            </Text>
            <TouchableOpacity style={styles.endBattleButton} onPress={handleEndBattle}>
              <Text style={styles.endBattleButtonText}>End Battle</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Battle Log */}
        <ScrollView 
          style={styles.battleLog}
          contentContainerStyle={styles.battleLogContent}
          showsVerticalScrollIndicator={false}
        >
          {battleLog.slice(-4).map((message, index) => (
            <Text key={index} style={[styles.logMessage, { color: theme.colors.subtext }]}>
              {message}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  battleField: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  enemySection: {
    alignItems: 'flex-start',
  },
  playerSection: {
    alignItems: 'flex-end',
  },
  pokemonContainer: {
    marginVertical: 10,
  },
  pokemonSprite: {
    width: 120,
    height: 120,
  },
  pokemonInfo: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 12,
    minWidth: 150,
  },
  enemyInfo: {
    marginBottom: 10,
  },
  playerInfo: {
    marginTop: 10,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pokemonLevel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  hpBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hpBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  hpBarFill: {
    height: '100%',
  },
  hpText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
    minWidth: 45,
  },
  battleInterface: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.5, // Max 50% of screen height
  },
  turnIndicator: {
    alignItems: 'center',
    marginBottom: 15,
  },
  turnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  movesContainer: {
    marginBottom: 15,
  },
  movesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  movesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moveButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  moveName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moveDetails: {
    fontSize: 11,
    marginBottom: 2,
  },
  movePP: {
    fontSize: 10,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  endBattleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  endBattleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  battleLog: {
    maxHeight: 80,
  },
  battleLogContent: {
    paddingVertical: 10,
  },
  logMessage: {
    fontSize: 13,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
});