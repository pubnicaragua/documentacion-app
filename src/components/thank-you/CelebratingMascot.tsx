"use client"

import { useRef, useEffect } from "react"
import { StyleSheet, View, Animated, Easing } from "react-native"
import { SvgXml } from "react-native-svg"
import { almiehappysvg } from "@/indexsvfg"

const CelebratingMascot = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const confettiAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animación de rebote para la mascota
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Animación de rotación para el confeti
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()

    // Animación de opacidad para el confeti
    Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View style={styles.container}>
      {/* Confeti animado
      <Animated.View
        style={[
          styles.confetti,
          {
            opacity: confettiAnim,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Image source={require("../../assets/icon.png")} style={styles.confettiImage} />
      </Animated.View> */}

      {/* Mascota animada */}
      {/* <Animated.View style={[styles.mascotContainer, { transform: [{ translateY: bounceAnim }] }]}> */}
      <SvgXml xml={almiehappysvg} style={{ transform: [{ scale: 1.4 }] }} />
      {/* </Animated.View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    height: 200,
  },
  mascotContainer: {
    position: "relative",
    zIndex: 2,
  },
  mascotImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  confetti: {
    position: "absolute",
    width: 200,
    height: 200,
    zIndex: 1,
  },
  confettiImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
})

export default CelebratingMascot
