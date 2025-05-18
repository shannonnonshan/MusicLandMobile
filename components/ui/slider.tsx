import SliderPrimitive, { SliderProps } from '@react-native-community/slider';
import React from 'react';
import { StyleSheet } from 'react-native';

const Slider = React.forwardRef<SliderPrimitive, SliderProps>((props, ref) => {
  return (
    <SliderPrimitive
      {...props}
      minimumTrackTintColor="#7c3aed"
      maximumTrackTintColor="#fff"
      thumbTintColor="#a78bfa"
      style={[styles.slider, props.style]}
    />
  );
});

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 40,
  },
});

Slider.displayName = 'Slider';

export { Slider };
