import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/ThemeContext';
import { router } from 'expo-router';
import { rubikFontFamily } from '@/constants/fonts';

type ThemeOption = {
  key: 'light' | 'dark' | 'system';
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Appearance
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
                    <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preview
          </Text>
          <View style={[styles.previewCard, { backgroundColor: theme.colors.bg, borderColor: theme.colors.border }]}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.previewBadgeText, { color: theme.colors.white }]}>001</Text>
              </View>
              <Text style={[styles.previewName, { color: theme.colors.text }]}>Bulbasaur</Text>
            </View>
            <Text style={[styles.previewSubtext, { color: theme.colors.subtext }]}>
              {isDark ? 'Dark mode is active' : 'Light mode is active'}
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.panel, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.subtext }]}>
            Theme changes are applied immediately and will be remembered when you restart the app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: rubikFontFamily.bold,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
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
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
