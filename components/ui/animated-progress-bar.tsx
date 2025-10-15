import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../constants/ThemeContext';

const { width } = Dimensions.get('window');

interface AnimatedProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  duration?: number;
}

export default function AnimatedProgressBar({
  progress,
  height = 8,
  color,
  backgroundColor,
  animated = true,
  duration = 800,
}: AnimatedProgressBarProps) {
  const { theme } = useTheme();
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  const finalColor = color || theme.colors.primary;
  const finalBgColor = backgroundColor || theme.colors.border;

  useEffect(() => {
    if (animated) {
      // Animate the progress bar width
      Animated.timing(progressWidth, {
        toValue: (progress / 100) * width,
        duration,
        useNativeDriver: false,
      }).start();

      // Animate a shimmer effect
      const shimmer = () => {
        animatedProgress.setValue(0);
        Animated.timing(animatedProgress, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start(() => {
          if (progress < 100) {
            shimmer();
          }
        });
      };
      shimmer();
    } else {
      progressWidth.setValue((progress / 100) * width);
    }
  }, [progress, animated, duration]);

  const shimmerTranslateX = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.container, { height, backgroundColor: finalBgColor }]}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressWidth,
            backgroundColor: finalColor,
            height,
          },
        ]}
      >
        {animated && progress > 0 && progress < 100 && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: shimmerTranslateX }],
              },
            ]}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 4,
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 50,
  },
});