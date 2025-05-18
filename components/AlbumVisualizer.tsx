import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface AlbumVisualizerProps {
  isPlaying: boolean;
}

const AlbumVisualizer: React.FC<AlbumVisualizerProps> = ({ isPlaying }) => {
  const bars = Array.from({ length: 12 }, () => new Animated.Value(10));

  useEffect(() => {
    if (isPlaying) {
      const animations = bars.map((bar, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: Math.random() * 80 + 10,
              duration: 800 + Math.random() * 500,
              useNativeDriver: false,
            }),
            Animated.timing(bar, {
              toValue: 10,
              duration: 800 + Math.random() * 500,
              useNativeDriver: false,
            }),
          ]),
        ),
      );
      Animated.stagger(50, animations).start();

      return () => animations.forEach(anim => anim.stop());
    } else {
      bars.forEach(bar => bar.setValue(10));
    }
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[styles.bar, { height: bars[index] }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 64,
    marginTop: 16,
    gap: 4,
  },
  bar: {
    width: 6,
    backgroundColor: '#a78bfa', // màu tím
    borderRadius: 2,
  },
});

export default AlbumVisualizer;
