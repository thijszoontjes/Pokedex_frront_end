import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Translation keys and values
export interface Translations {
  // Navigation
  'nav.home': string;
  'nav.favorites': string;
  'nav.settings': string;

  // Home Screen
  'home.title': string;
  'home.search.placeholder': string;
  'home.loaded': string;
  'home.battleTest': string;
  'home.loading': string;
  'home.error': string;
  'home.errorMessage': string;

  // Pokemon Details
  'pokemon.about': string;
  'pokemon.stats': string;
  'pokemon.evolution': string;
  'pokemon.battle': string;
  'pokemon.name': string;
  'pokemon.height': string;
  'pokemon.weight': string;
  'pokemon.types': string;
  'pokemon.abilities': string;
  'pokemon.baseExperience': string;

  // Battle System
  'battle.title': string;
  'battle.yourTurn': string;
  'battle.enemyTurn': string;
  'battle.chooseMove': string;
  'battle.victory': string;
  'battle.defeat': string;
  'battle.endBattle': string;
  'battle.test.title': string;
  'battle.test.description': string;
  'battle.test.start': string;
  'battle.test.back': string;
  'battle.test.features': string;

  // Settings
  'settings.title': string;
  'settings.language': string;
  'settings.theme': string;
  'settings.about': string;
  'settings.version': string;

  // Theme
  'theme.light': string;
  'theme.dark': string;
  'theme.system': string;

  // Common
  'common.loading': string;
  'common.error': string;
  'common.retry': string;
  'common.cancel': string;
  'common.ok': string;
  'common.back': string;

  // Favorites
  'favorites.title': string;
  'favorites.empty': string;
  'favorites.added': string;
  'favorites.removed': string;
}

const englishTranslations: Translations = {
  // Navigation
  'nav.home': 'Home',
  'nav.favorites': 'Favorites',
  'nav.settings': 'Settings',

  // Home Screen
  'home.title': 'All Pokémon',
  'home.search.placeholder': 'Search for Pokémon..',
  'home.loaded': 'loaded',
  'home.battleTest': '🎮 Test Battle System',
  'home.loading': 'Loading Pokémon…',
  'home.error': 'Error',
  'home.errorMessage': 'Failed to load data',

  // Pokemon Details
  'pokemon.about': 'About',
  'pokemon.stats': 'Stats',
  'pokemon.evolution': 'Evolution',
  'pokemon.battle': 'Battle This Pokémon!',
  'pokemon.name': 'Name',
  'pokemon.height': 'Height',
  'pokemon.weight': 'Weight',
  'pokemon.types': 'Types',
  'pokemon.abilities': 'Abilities',
  'pokemon.baseExperience': 'Base Experience',

  // Battle System
  'battle.title': 'Battle Arena',
  'battle.yourTurn': 'Your Turn!',
  'battle.enemyTurn': "Enemy's Turn...",
  'battle.chooseMove': 'Choose a move:',
  'battle.victory': '🎉 Victory!',
  'battle.defeat': '💀 Defeat!',
  'battle.endBattle': 'End Battle',
  'battle.test.title': '🎮 Battle Test',
  'battle.test.description': 'Test the complete Pokémon Battle System with a quick Pikachu battle!',
  'battle.test.start': '⚡ Start Test Battle',
  'battle.test.back': '← Back to Home',
  'battle.test.features': 'Battle System Features:',

  // Settings
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.theme': 'Theme',
  'settings.about': 'About',
  'settings.version': 'Version',

  // Theme
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.retry': 'Retry',
  'common.cancel': 'Cancel',
  'common.ok': 'OK',
  'common.back': 'Back',

  // Favorites
  'favorites.title': 'Favorite Pokémon',
  'favorites.empty': 'No favorite Pokémon yet',
  'favorites.added': 'Added to Favorites! ❤️',
  'favorites.removed': 'Removed from Favorites',
};

const dutchTranslations: Translations = {
  // Navigation
  'nav.home': 'Start',
  'nav.favorites': 'Favorieten',
  'nav.settings': 'Instellingen',

  // Home Screen
  'home.title': 'Alle Pokémon',
  'home.search.placeholder': 'Zoek naar Pokémon..',
  'home.loaded': 'geladen',
  'home.battleTest': '🎮 Test Gevecht Systeem',
  'home.loading': 'Pokémon laden…',
  'home.error': 'Fout',
  'home.errorMessage': 'Kon data niet laden',

  // Pokemon Details
  'pokemon.about': 'Over',
  'pokemon.stats': 'Statistieken',
  'pokemon.evolution': 'Evolutie',
  'pokemon.battle': 'Vecht tegen deze Pokémon!',
  'pokemon.name': 'Naam',
  'pokemon.height': 'Lengte',
  'pokemon.weight': 'Gewicht',
  'pokemon.types': 'Types',
  'pokemon.abilities': 'Vaardigheden',
  'pokemon.baseExperience': 'Basis Ervaring',

  // Battle System
  'battle.title': 'Gevecht Arena',
  'battle.yourTurn': 'Jouw Beurt!',
  'battle.enemyTurn': 'Vijand aan de Beurt...',
  'battle.chooseMove': 'Kies een aanval:',
  'battle.victory': '🎉 Overwinning!',
  'battle.defeat': '💀 Nederlaag!',
  'battle.endBattle': 'Beëindig Gevecht',
  'battle.test.title': '🎮 Gevecht Test',
  'battle.test.description': 'Test het complete Pokémon Gevecht Systeem met een snelle Pikachu gevecht!',
  'battle.test.start': '⚡ Start Test Gevecht',
  'battle.test.back': '← Terug naar Start',
  'battle.test.features': 'Gevecht Systeem Functies:',

  // Settings
  'settings.title': 'Instellingen',
  'settings.language': 'Taal',
  'settings.theme': 'Thema',
  'settings.about': 'Over',
  'settings.version': 'Versie',

  // Theme
  'theme.light': 'Licht',
  'theme.dark': 'Donker',
  'theme.system': 'Systeem',

  // Common
  'common.loading': 'Laden...',
  'common.error': 'Fout',
  'common.retry': 'Opnieuw proberen',
  'common.cancel': 'Annuleren',
  'common.ok': 'OK',
  'common.back': 'Terug',

  // Favorites
  'favorites.title': 'Favoriete Pokémon',
  'favorites.empty': 'Nog geen favoriete Pokémon',
  'favorites.added': 'Toegevoegd aan Favorieten! ❤️',
  'favorites.removed': 'Verwijderd uit Favorieten',
};

export type Language = 'en' | 'nl';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  translations: Translations;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// const STORAGE_KEY = '@pokegex_language'; // Disabled for now

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language on startup (simplified without AsyncStorage for now)
  useEffect(() => {
    // Default to English, can be enhanced later with proper storage
    setLanguageState('en');
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // TODO: Add proper persistent storage when AsyncStorage is working
    console.log('Language changed to:', lang);
  };

  const getTranslations = (): Translations => {
    switch (language) {
      case 'nl':
        return dutchTranslations;
      case 'en':
      default:
        return englishTranslations;
    }
  };

  const t = (key: keyof Translations): string => {
    const translations = getTranslations();
    return translations[key] || key;
  };

  const value: LocalizationContextType = {
    language,
    setLanguage,
    t,
    translations: getTranslations(),
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}