import { useRef, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

// Custom hooks for different animation types
export function useFadeIn(duration = 500, delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [opacity, duration, delay]);

  return { opacity };
}

export function useSlideIn(direction: 'left' | 'right' | 'up' | 'down' = 'up', duration = 500, delay = 0) {
  const translateValue = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateValue, {
          toValue: 0,
          duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.1)),
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration * 0.8,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        })
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [translateValue, opacity, duration, delay]);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return { translateX: translateValue.interpolate({
          inputRange: [0, 50],
          outputRange: [0, -50],
        })};
      case 'right':
        return { translateX: translateValue };
      case 'up':
        return { translateY: translateValue.interpolate({
          inputRange: [0, 50],
          outputRange: [0, -50],
        })};
      case 'down':
        return { translateY: translateValue };
      default:
        return { translateY: translateValue };
    }
  };

  return { 
    opacity, 
    transform: [getTransform()]
  };
}

export function useScale(duration = 400, delay = 0, finalScale = 1) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: finalScale,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration * 0.6,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        })
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [scale, opacity, duration, delay, finalScale]);

  return { 
    opacity, 
    transform: [{ scale }]
  };
}

export function usePulse(duration = 1000) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [scale, duration]);

  return { transform: [{ scale }] };
}

export function useRotate(duration = 2000) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = () => {
      rotation.setValue(0);
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => rotate());
    };

    rotate();
  }, [rotation, duration]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return { transform: [{ rotate: rotateInterpolate }] };
}

export function useStaggeredAnimation(count: number, duration = 300, staggerDelay = 100) {
  const animations = useRef(
    Array.from({ length: count }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;

  const startAnimation = useCallback(() => {
    const animationSequence = animations.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration,
          delay: index * staggerDelay,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration,
          delay: index * staggerDelay,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.1)),
        }),
      ])
    );

    Animated.parallel(animationSequence).start();
  }, [animations, duration, staggerDelay]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  return animations.map(anim => ({
    opacity: anim.opacity,
    transform: [{ translateY: anim.translateY }],
  }));
}
