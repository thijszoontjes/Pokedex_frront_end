import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useBattle } from '../constants/BattleContext';
import { useTheme } from '../constants/ThemeContext';
import { useLocalization } from '../constants/LocalizationContext';

// Test Pokemon data
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
} as any;

export default function BattleTestScreen() {
  const { theme } = useTheme();
  const { startBattle } = useBattle();
  const { t } = useLocalization();
  const styles = createStyles(theme);

  const handleStartTestBattle = () => {
    Alert.alert(
      t('battle.test.start'),
      t('battle.test.description'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('battle.test.start'),
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
          {t('battle.test.title')}
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.subtext }]}>
          {t('battle.test.description')}
        </Text>

        <TouchableOpacity 
          style={styles.battleButton}
          onPress={handleStartTestBattle}
        >
          <Text style={styles.battleButtonText}>{t('battle.test.start')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.backButton, { borderColor: theme.colors.border }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.text }]}>
            {t('battle.test.back')}
          </Text>
        </TouchableOpacity>

        <View style={styles.features}>
          <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>
            {t('battle.test.features')}
          </Text>
          <Text style={[styles.feature, { color: theme.colors.subtext }]}>
            • Turn-based combat system
          </Text>
          <Text style={[styles.feature, { color: theme.colors.subtext }]}>
            • Pokemon stat calculations
          </Text>
          <Text style={[styles.feature, { color: theme.colors.subtext }]}>
            • Type effectiveness system
          </Text>
          <Text style={[styles.feature, { color: theme.colors.subtext }]}>
            • Move database with PP system
          </Text>
          <Text style={[styles.feature, { color: theme.colors.subtext }]}>
            • Battle animations & effects
          </Text>
          <Text style={[styles.feature, { color: theme.colors.subtext }]}>
            • AI opponent logic
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  backButton: {
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 40,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 300,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  feature: {
    fontSize: 14,
    marginBottom: 6,
  },
});