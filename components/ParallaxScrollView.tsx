type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  contentContainerStyle?: object; // thêm prop này
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  contentContainerStyle, // nhận prop
}: Props) {
  // ...
  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={[{ paddingBottom: bottom }, contentContainerStyle]} // merge style
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}
