import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import logo from "@/assets/images/icon-egg.png";
import { FONTS } from "@/constants/styles/fonts";
import { createThemedStyles } from "@/lib/utils";
import { useThemedStyles } from "@/providers/theme-provider";

export const BouncingText = ({
  text,
  withLogo = true,
}: {
  text: string;
  withLogo?: boolean;
}) => {
  const styles = useThemedStyles(themedStyles);

  const imageAnim = useRef(new Animated.Value(0)).current;
  const animations = useRef(
    text.split("").map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const numChars = text.length;
    const staggerDelay = 100;
    const logoDuration = withLogo ? 200 : 0;
    const pauseAfterComplete = 2000;
    const bounceHeight = 8;
    const bounceDuration = 150;

    const animateSequence = () => {
      const imageAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(imageAnim, {
            toValue: -1 * bounceHeight,
            duration: bounceDuration,
            useNativeDriver: true,
          }),
          Animated.timing(imageAnim, {
            toValue: 0,
            duration: bounceDuration,
            useNativeDriver: true,
          }),
          Animated.delay(numChars * staggerDelay + pauseAfterComplete),
        ])
      );

      const staggeredAnimations = animations.map((anim, index) => {
        const initialDelay = logoDuration + index * staggerDelay;
        const waitAfterBounce =
          (numChars - 1 - index) * staggerDelay + pauseAfterComplete;

        return Animated.loop(
          Animated.sequence([
            Animated.delay(initialDelay),
            Animated.timing(anim, {
              toValue: -1 * bounceHeight,
              duration: bounceDuration,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: bounceDuration,
              useNativeDriver: true,
            }),
            Animated.delay(waitAfterBounce),
          ])
        );
      });

      Animated.parallel([imageAnimation, ...staggeredAnimations]).start();
    };

    animateSequence();
  }, [text, animations, imageAnim, withLogo]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {withLogo && (
        <Animated.View style={{ transform: [{ translateY: imageAnim }] }}>
          <Image source={logo} style={{ height: 20, width: 20 }} />
        </Animated.View>
      )}
      {text.split("").map((char, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.loadingText,
            {
              transform: [{ translateY: animations[index] }],
            },
          ]}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  );
};

const themedStyles = createThemedStyles(({ colors, isDark }) => ({
  loadingText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: FONTS.title,
    color: colors.textMuted,
  },
}));
