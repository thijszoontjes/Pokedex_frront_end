import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { useLocalization } from '../../constants/LocalizationContext';
import { rubikFontFamily } from '@/constants/fonts';

type ThemeOption = {
  key: 'light' | 'dark' | 'system';
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function SettingsTabScreen() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const { language, setLanguage, t } = useLocalization();

  const themeOptions: ThemeOption[] = [
    {
      key: 'light',
      title: 'Light Mode',
      subtitle: 'Always use light theme',
      icon: 'sunny-outline',
    },
    {
      key: 'dark',
      title: 'Dark Mode',
      subtitle: 'Always use dark theme',
      icon: 'moon-outline',
    },
    {
      key: 'system',
      title: 'System Default',
      subtitle: 'Follow device settings',
      icon: 'phone-portrait-outline',
    },
  ];

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Language Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            � {t('settings.language')}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.subtext }]}>
            Choose your preferred language
          </Text>

          <TouchableOpacity
            style={[styles.languageOption, { borderColor: theme.colors.border }]}
            onPress={() => {
              Alert.alert(
                t('settings.language'),
                'Choose your preferred language / Kies je voorkeurstaal',
                [
                  {
                    text: 'English',
                    onPress: () => setLanguage('en'),
                  },
                  {
                    text: 'Nederlands',
                    onPress: () => setLanguage('nl'),
                  },
                  {
                    text: t('common.cancel'),
                    style: 'cancel',
                  },
                ]
              );
            }}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: theme.colors.bg }]}>
                <Ionicons 
                  name="language" 
                  size={22} 
                  color={theme.colors.primary} 
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                  {language === 'en' ? 'English' : 'Nederlands'}
                </Text>
                <Text style={[styles.optionSubtitle, { color: theme.colors.subtext }]}>
                  {language === 'en' ? 'App language' : 'App taal'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🎨 {t('settings.theme')}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.subtext }]}>
            Choose how the app looks on your device
          </Text>

          {themeOptions.map((option, index) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionItem,
                index === themeOptions.length - 1 && styles.lastOptionItem,
                { borderBottomColor: theme.colors.border }
              ]}
              onPress={() => handleThemeChange(option.key)}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, { backgroundColor: theme.colors.bg }]}>
                  <Ionicons 
                    name={option.icon} 
                    size={22} 
                    color={themeMode === option.key ? theme.colors.primary : theme.colors.subtext} 
                  />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: theme.colors.subtext }]}>
                    {option.subtitle}
                  </Text>
                </View>
              </View>
              <View style={styles.optionRight}>
                <View style={[
                  styles.radioButton,
                  { 
                    borderColor: themeMode === option.key ? theme.colors.primary : theme.colors.border,
                    backgroundColor: themeMode === option.key ? theme.colors.primary : 'transparent'
                  }
                ]}>
                  {themeMode === option.key && (
                    <Ionicons name="checkmark" size={16} color={theme.colors.badgeText} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            👀 Preview
          </Text>
          <View style={[styles.previewCard, { backgroundColor: theme.colors.bg, borderColor: theme.colors.border }]}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.previewBadgeText, { color: theme.colors.badgeText }]}>001</Text>
              </View>
              <Text style={[styles.previewName, { color: theme.colors.text }]}>Bulbasaur</Text>
            </View>
            <Text style={[styles.previewSubtext, { color: theme.colors.subtext }]}>
              {isDark ? '🌙 Dark mode is active' : '☀️ Light mode is active'}
            </Text>
            <Text style={[styles.previewSubtext, { color: theme.colors.subtext, marginTop: 4 }]}>
              Current theme: {themeMode === 'system' ? 'System Default' : themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
        </View>

        {/* App Info Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📱 About Pokédex
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>Version</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>Built with</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>React Native & Expo</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>Data from</Text>
            <Text style={[styles.infoValue, { color: theme.colors.primary }]}>PokéAPI</Text>
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: rubikFontFamily.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: rubikFontFamily.bold,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: rubikFontFamily.semiBold,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
  },
  optionRight: {
    marginLeft: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  previewBadgeText: {
    fontSize: 12,
    fontFamily: rubikFontFamily.bold,
  },
  previewName: {
    fontSize: 16,
    fontFamily: rubikFontFamily.bold,
  },
  previewSubtext: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: rubikFontFamily.semiBold,
  },
});
