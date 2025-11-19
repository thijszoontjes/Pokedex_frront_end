import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, Alert, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { rubikFontFamily } from "@/constants/fonts";

type ActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  pokemonId: number;
  pokemonName: string;
  onOpenDetail: () => void;
  onAddToFavorites: () => void;
};

export default function PokemonActionSheet({
  visible,
  onClose,
  pokemonId,
  pokemonName,
  onOpenDetail,
  onAddToFavorites,
}: ActionSheetProps) {
  
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${pokemonName}! 🎮✨\n\nPokémon #${pokemonId.toString().padStart(3, "0")}\n\nShared from my Pokédex app 📱`,
        title: `${pokemonName} - Pokédex`,
      });
      
      if (result.action === Share.sharedAction) {
        // Pokemon shared successfully
      }
    } catch {
      // Error occurred during sharing
      Alert.alert("Error", "Failed to share Pokemon");
    }
    onClose();
  };

  const actions = [
    {
      icon: "open-outline" as const,
      title: "Open Pokémon",
      subtitle: "View details",
      onPress: () => {
        onClose();
        onOpenDetail();
      },
    },
    {
      icon: "heart-outline" as const,
      title: "Add to favorites",
      subtitle: "Save for later",
      onPress: () => {
        onClose();
        onAddToFavorites();
      },
    },
    {
      icon: "share-outline" as const,
      title: "Share",
      subtitle: "Tell friends about this Pokémon",
      onPress: handleShare,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.pokemonName}>
              {pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}
            </Text>
            <Text style={styles.pokemonId}>
              #{pokemonId.toString().padStart(3, "0")}
            </Text>
          </View>

          <View style={styles.actions}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionItem,
                  index === actions.length - 1 && styles.lastActionItem,
                ]}
                onPress={action.onPress}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon} size={24} color={theme.colors.text} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: theme.colors.panel,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area bottom padding
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pokemonName: {
    fontSize: 20,
    fontFamily: rubikFontFamily.bold,
    color: theme.colors.text,
  },
  pokemonId: {
    fontSize: 16,
    color: theme.colors.subtext,
    marginTop: 4,
  },
  actions: {
    paddingHorizontal: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastActionItem: {
    borderBottomWidth: 0,
  },
  actionIcon: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: rubikFontFamily.semiBold,
    color: theme.colors.text,
  },
  actionSubtitle: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginTop: 2,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.lg,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontFamily: rubikFontFamily.semiBold,
    color: theme.colors.text,
  },
});
