import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useBattle } from '../constants/BattleContext';
import { useTheme } from '../constants/ThemeContext';
import { rubikFontFamily } from '@/constants/fonts';
import type { Pokemon } from 'pokenode-ts';

// Simple test Pokemon data - the battle system only needs basic properties
const testPikachu = {
  id: 25,
  name: 'pikachu',
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'
  },
  types: [
    { type: { name: 'electric' } }
  ],
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
    { base_stat: 40, stat: { name: 'defense' } },
    { base_stat: 90, stat: { name: 'speed' } }
  ],
  height: 4,
  weight: 60,
  base_experience: 112,
  abilities: [
    { ability: { name: 'static' } }
  ]
} as Pokemon;

export default function BattleTestScreen() {
  const { theme } = useTheme();
  const { startBattle } = useBattle();
  const styles = createStyles();

  const handleStartTestBattle = () => {
    Alert.alert(
      'Start Test Battle',
      'This will start a battle with Pikachu to test the battle system.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Battle',
          onPress: () => {
            startBattle(testPikachu);
            router.push('/battle');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Battle Test
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.subtext }]}>
          Test the Pokemon battle system with a pre-configured Pikachu battle.
        </Text>

        <TouchableOpacity 
          style={styles.battleButton}
          onPress={handleStartTestBattle}
        >
          <Text style={styles.battleButtonText}>Start Test Battle</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.backButton, { borderColor: theme.colors.border }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.text }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: rubikFontFamily.bold,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  battleButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  battleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: rubikFontFamily.bold,
    textAlign: 'center',
  },
  backButton: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
