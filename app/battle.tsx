import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBattle, BattleMove } from '../constants/BattleContext';
import { useTheme } from '../constants/ThemeContext';

// Simple animated progress bar component
const ProgressBar: React.FC<{
  current: number;
  max: number;
  color: string;
  backgroundColor: string;
}> = ({ current, max, color, backgroundColor }) => {
  const [animatedWidth] = useState(new Animated.Value((current / max) * 100));
  
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: (current / max) * 100,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [current, max]);

  return (
    <View style={[progressBarStyles.container, { backgroundColor }]}>
      <Animated.View 
        style={[
          progressBarStyles.fill,
          { 
            backgroundColor: color,
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp'
            })
          }
        ]} 
      />
    </View>
  );
};

const progressBarStyles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 4,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default function BattleScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { battleState, useMove } = useBattle();
  
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [flashAnimation] = useState(new Animated.Value(0));
  const isProcessingTurnRef = useRef(false);
  const [turnDisplay, setTurnDisplay] = useState('');

  const { playerPokemon, enemyPokemon, currentTurn, battlePhase, battleLog, isAnimating } = battleState;

  // Battle ended effect
  useEffect(() => {
    if ((battlePhase === 'victory' || battlePhase === 'defeat') && playerPokemon && enemyPokemon) {
      const winner = battlePhase === 'victory' ? 'player' : 'enemy';
      const message = winner === 'player' 
        ? `${playerPokemon.name} won the battle!`
        : `${enemyPokemon.name} won the battle!`;
      
      Alert.alert(
        winner === 'player' ? 'Victory!' : 'Defeat!',
        message,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [battlePhase, playerPokemon, enemyPokemon]);

  // Update turn display
  useEffect(() => {
    if (currentTurn === 'player') {
      setTurnDisplay('Your Turn!');
    } else if (currentTurn === 'enemy') {
      setTurnDisplay(isProcessingTurnRef.current ? 'Enemy Turn... (Thinking...)' : 'Enemy Turn...');
    }
  }, [currentTurn]);

  // Auto enemy turn with proper state management
  useEffect(() => {
    if (currentTurn === 'enemy' && battlePhase === 'battle' && enemyPokemon && !isAnimating && !isProcessingTurnRef.current) {
      // Starting enemy turn
      isProcessingTurnRef.current = true;
      setTurnDisplay('Enemy Turn... (Thinking...)');
      
      const timer = setTimeout(() => {
        try {
          // Enemy AI: pick random available move
          const availableMoves = enemyPokemon.moves.filter(move => move.pp > 0);
          if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            // Enemy using selected move
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useMove(randomMove, 'enemy');
            triggerBattleAnimation();
          }
        } catch (_error) {
          // Enemy turn error occurred
        } finally {
          isProcessingTurnRef.current = false;
          setTurnDisplay('Enemy Turn...');
        }
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        isProcessingTurnRef.current = false;
      };
    }
  }, [currentTurn, battlePhase, enemyPokemon?.id, isAnimating]);

  const triggerBattleAnimation = () => {
    // Shake animation for impact
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    // Flash animation for damage
    Animated.sequence([
      Animated.timing(flashAnimation, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(flashAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePlayerMove = (move: BattleMove) => {
    if (currentTurn === 'player' && !isAnimating && !isProcessingTurnRef.current) {
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useMove(move, 'player');
        triggerBattleAnimation();
      } catch (_error) {
        // Player move error occurred
      }
    }
  };

  const handleRunAway = () => {
    Alert.alert(
      'Run Away?',
      'Are you sure you want to flee from this battle?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => router.back() }
      ]
    );
  };

  if (!playerPokemon || !enemyPokemon) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Loading battle...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Battle Arena</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Battle Field */}
      <View style={styles.battleField}>
        {/* Enemy Pokemon */}
        <View style={styles.enemySection}>
          <View style={[styles.pokemonInfoCard, { backgroundColor: theme.colors.panel }]}>
            <Text style={[styles.pokemonName, { color: theme.colors.text }]}>
              {enemyPokemon.name}
            </Text>
            <Text style={[styles.pokemonLevel, { color: theme.colors.subtext }]}>
              Lv.{enemyPokemon.level}
            </Text>
            <ProgressBar
              current={enemyPokemon.currentHp}
              max={enemyPokemon.maxHp}
              color={enemyPokemon.currentHp / enemyPokemon.maxHp > 0.5 ? '#4CAF50' : 
                    enemyPokemon.currentHp / enemyPokemon.maxHp > 0.2 ? '#FF9800' : '#F44336'}
              backgroundColor={theme.colors.border}
            />
            <Text style={[styles.hpText, { color: theme.colors.subtext }]}>
              {enemyPokemon.currentHp}/{enemyPokemon.maxHp} HP
            </Text>
          </View>
          
          <Animated.View 
            style={[
              styles.pokemonImageContainer,
              { 
                transform: [{ 
                  translateX: shakeAnimation.interpolate({
                    inputRange: [-10, 10],
                    outputRange: [-10, 10]
                  })
                }]
              }
            ]}
          >
            <Animated.View style={{ opacity: flashAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.2]
            })}}>
              <Image
                source={{
                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${enemyPokemon.id}.png`
                }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            </Animated.View>
          </Animated.View>
        </View>

        {/* Player Pokemon */}
        <View style={styles.playerSection}>
          <Animated.View 
            style={[
              styles.pokemonImageContainer,
              { 
                transform: [{ 
                  translateX: shakeAnimation.interpolate({
                    inputRange: [-10, 10],
                    outputRange: [10, -10]
                  })
                }]
              }
            ]}
          >
            <Animated.View style={{ opacity: flashAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.2]
            })}}>
              <Image
                source={{
                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${playerPokemon.id}.png`
                }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            </Animated.View>
          </Animated.View>
          
          <View style={[styles.pokemonInfoCard, { backgroundColor: theme.colors.panel }]}>
            <Text style={[styles.pokemonName, { color: theme.colors.text }]}>
              {playerPokemon.name}
            </Text>
            <Text style={[styles.pokemonLevel, { color: theme.colors.subtext }]}>
              Lv.{playerPokemon.level}
            </Text>
            <ProgressBar
              current={playerPokemon.currentHp}
              max={playerPokemon.maxHp}
              color={playerPokemon.currentHp / playerPokemon.maxHp > 0.5 ? '#4CAF50' : 
                    playerPokemon.currentHp / playerPokemon.maxHp > 0.2 ? '#FF9800' : '#F44336'}
              backgroundColor={theme.colors.border}
            />
            <Text style={[styles.hpText, { color: theme.colors.subtext }]}>
              {playerPokemon.currentHp}/{playerPokemon.maxHp} HP
            </Text>
          </View>
        </View>
      </View>

      {/* Battle Interface */}
      <View style={[styles.battleInterface, { backgroundColor: theme.colors.panel }]}>
        {battlePhase === 'battle' ? (
          <>
            {/* Battle Log */}
            {battleLog.length > 0 && (
              <ScrollView 
                style={styles.battleLog}
                showsVerticalScrollIndicator={false}
              >
                {battleLog.slice(-3).map((log, index) => (
                  <Text key={index} style={[styles.logText, { color: theme.colors.text }]}>
                    {log}
                  </Text>
                ))}
              </ScrollView>
            )}

            {/* Turn Indicator */}
            <View style={styles.turnIndicator}>
              <Text style={[styles.turnText, { color: theme.colors.text }]}>
                {turnDisplay}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {currentTurn === 'player' && !isProcessingTurnRef.current ? (
                <>
                  {/* Moves */}
                  <View style={styles.movesGrid}>
                    {playerPokemon.moves.map((move, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.moveButton,
                          { 
                            backgroundColor: move.pp > 0 ? theme.colors.primary : theme.colors.border,
                            opacity: move.pp > 0 ? 1 : 0.5
                          }
                        ]}
                        onPress={() => handlePlayerMove(move)}
                        disabled={move.pp === 0 || isAnimating}
                      >
                        <Text style={[styles.moveText, { color: 'white' }]}>
                          {move.name}
                        </Text>
                        <Text style={[styles.ppText, { color: 'white' }]}>
                          PP: {move.pp}/{move.maxPp}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Run Button */}
                  <TouchableOpacity
                    style={[styles.runButton, { backgroundColor: theme.colors.error }]}
                    onPress={handleRunAway}
                    disabled={isAnimating}
                  >
                    <Ionicons name="exit-outline" size={24} color="white" />
                    <Text style={[styles.runText, { color: 'white' }]}>
                      Run Away
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.waitingContainer}>
                  <Text style={[styles.waitingText, { color: theme.colors.text }]}>
                    {turnDisplay === 'Enemy Turn... (Thinking...)' ? 'Enemy is choosing a move...' : 'Waiting for turn...'}
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.centerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Preparing battle...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof import('../constants/theme').createTheme>) => StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
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
    flex: 0.6,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  enemySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pokemonInfoCard: {
    padding: 15,
    borderRadius: 12,
    minWidth: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  pokemonLevel: {
    fontSize: 14,
    marginBottom: 8,
  },
  hpText: {
    fontSize: 12,
    marginTop: 4,
  },
  pokemonImageContainer: {
    alignItems: 'center',
  },
  pokemonImage: {
    width: 120,
    height: 120,
  },
  battleInterface: {
    flex: 0.4,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  battleLog: {
    maxHeight: 60,
    marginBottom: 10,
  },
  logText: {
    fontSize: 14,
    marginBottom: 4,
    paddingHorizontal: 5,
  },
  turnIndicator: {
    alignItems: 'center',
    marginBottom: 15,
  },
  turnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flex: 1,
  },
  movesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  moveButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  moveText: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  ppText: {
    fontSize: 12,
    marginTop: 2,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  runText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});