import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

interface MarqueeTextProps {
  text: string;
  duration?: number;
  style?: TextStyle | TextStyle[];
  containerStyle?: ViewStyle;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  duration = 7000,
  style,
  containerStyle,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (textWidth === 0 || containerWidth === 0 ) return;

    translateX.setValue(containerWidth);

    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -textWidth,
          duration,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    anim.start();

    return () => anim.stop();
  }, [textWidth, containerWidth]);

  const onTextLayout = (e: LayoutChangeEvent) => {
    setTextWidth(e.nativeEvent.layout.width);
  };

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      style={[{ overflow: 'hidden', width: '100%' }, containerStyle]}
      onLayout={onContainerLayout}
    >
      <Animated.Text
        onLayout={onTextLayout}

        style={[{paddingLeft: 10, paddingRight: 10, alignSelf: 'center'},
          { transform: [{ translateX }] },
          Array.isArray(style) ? style : [style],
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};
