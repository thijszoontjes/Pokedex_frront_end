import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { useLocalization } from '../../constants/LocalizationContext';
import { usePulse, useRotate, useStaggeredAnimation } from '../../constants/AnimationHooks';

const { width } = Dimensions.get('window');

interface AnimatedLoadingProps {
  message?: string;
  type?: 'pokeball' | 'dots' | 'pulse' | 'bars';
}

export default function AnimatedLoading({ 
  message, 
  type = 'pokeball' 
}: AnimatedLoadingProps) {
  const { theme } = useTheme();
  const { t } = useLocalization();
  const styles = createStyles(theme);

  const renderPokeballLoader = () => {
    const rotateAnimation = useRotate(2000);
    const pulseAnimation = usePulse(1500);

    return (
      <View style={styles.pokeballContainer}>
        <Animated.View style={[styles.pokeballOuter, pulseAnimation]}>
          <Animated.View style={[rotateAnimation]}>
            <MaterialCommunityIcons 
              name="pokeball" 
              size={60} 
              color={theme.colors.primary} 
            />
          </Animated.View>
        </Animated.View>
      </View>
    );
  };

  const renderDotLoader = () => {
    const dotAnimations = useStaggeredAnimation(3, 400, 200);

    return (
      <View style={styles.dotsContainer}>
        {dotAnimations.map((animation, index) => (
          <Animated.View
            key={index}
            style={[styles.dot, { backgroundColor: theme.colors.primary }, animation]}
          />
        ))}
      </View>
    );
  };

  const renderPulseLoader = () => {
    const pulseAnimation = usePulse(800);

    return (
      <Animated.View style={[styles.pulseCircle, { borderColor: theme.colors.primary }, pulseAnimation]}>
        <View style={[styles.pulseInner, { backgroundColor: theme.colors.primary }]} />
      </Animated.View>
    );
  };

  const renderBarsLoader = () => {
    const barAnimations = useStaggeredAnimation(4, 600, 150);

    return (
      <View style={styles.barsContainer}>
        {barAnimations.map((animation, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              { backgroundColor: theme.colors.primary },
              animation,
              { height: 30 + (index * 10) } // Varying heights
            ]}
          />
        ))}
      </View>
    );
  };

  const renderLoader = () => {
    switch (type) {
      case 'pokeball':
        return renderPokeballLoader();
      case 'dots':
        return renderDotLoader();
      case 'pulse':
        return renderPulseLoader();
      case 'bars':
        return renderBarsLoader();
      default:
        return renderPokeballLoader();
    }
  };

  return (
    <View style={styles.container}>
      {renderLoader()}
      
      {message && (
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>
      )}
      
      <View style={styles.loadingTextContainer}>
        <Text style={[styles.loadingText, { color: theme.colors.subtext }]}>
          {t('common.loading')}
        </Text>
        {renderDotLoader()}
      </View>
    </View>
  );
}

// Shimmer loading effect for cards
export function ShimmerCard() {
  const { theme } = useTheme();
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };

    shimmer();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={[shimmerStyles.card, { backgroundColor: theme.colors.panel }]}>
      <Animated.View 
        style={[
          shimmerStyles.shimmerImage, 
          { backgroundColor: theme.colors.border, opacity }
        ]} 
      />
      <View style={shimmerStyles.shimmerContent}>
        <Animated.View 
          style={[
            shimmerStyles.shimmerTitle, 
            { backgroundColor: theme.colors.border, opacity }
          ]} 
        />
        <Animated.View 
          style={[
            shimmerStyles.shimmerSubtitle, 
            { backgroundColor: theme.colors.border, opacity }
          ]} 
        />
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg,
    paddingHorizontal: 20,
  },
  pokeballContainer: {
    marginBottom: 20,
  },
  pokeballOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  pulseCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bar: {
    width: 8,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 14,
    marginRight: 8,
  },
});

const shimmerStyles = StyleSheet.create({
  card: {
    width: (width - 48) / 2,
    margin: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shimmerImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  shimmerContent: {
    gap: 6,
  },
  shimmerTitle: {
    height: 16,
    borderRadius: 4,
    marginBottom: 4,
  },
  shimmerSubtitle: {
    height: 12,
    borderRadius: 4,
    width: '70%',
  },
});