"use client"
import { useState, useEffect, useRef } from "react"
import { StyleSheet, View, Text, Animated, Easing } from "react-native"
import { SvgXml } from "react-native-svg"
import { fineface, veryfineface, verysadface, sadface, neutralface } from "@/indexsvfg"
import * as Haptics from "expo-haptics"

interface Emotion {
  id: number
  label: string
  icon: any
}

const emotions: Emotion[] = [
  { id: 1, label: "Muy mal", icon: verysadface },
  { id: 2, label: "Mal", icon: sadface },
  { id: 3, label: "Normal", icon: neutralface },
  { id: 4, label: "Bien", icon: fineface },
  { id: 5, label: "Muy bien", icon: veryfineface },
]

const EmotionsSelector = () => {
  const [focusedEmotion, setFocusedEmotion] = useState(0)
  const animatedValues = useRef(emotions.map(() => new Animated.Value(1))).current
  const colorValues = useRef(emotions.map(() => new Animated.Value(0))).current

  useEffect(() => {
    const interval = setInterval(() => {
      // Resetear la animación anterior
      Animated.timing(animatedValues[focusedEmotion], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      Animated.timing(colorValues[focusedEmotion], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()

      // Cambiar al siguiente elemento
      const nextEmotion = (focusedEmotion + 1) % emotions.length
      setFocusedEmotion(nextEmotion)

      // Animar el nuevo elemento
      Animated.sequence([
        Animated.timing(animatedValues[nextEmotion], {
          toValue: 1.1,
          duration: 150,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[nextEmotion], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()

      Animated.timing(colorValues[nextEmotion], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      // Vibración leve
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }, 4000)

    return () => {
      clearInterval(interval) // Detiene el intervalo
      animatedValues.forEach((anim) => anim.stopAnimation()) // Detiene todas las animaciones activas
      colorValues.forEach((anim) => anim.stopAnimation())
    }
  }, [focusedEmotion])

  return (
    <View style={styles.container}>
      {emotions.map((emotion, index) => {
        const backgroundColor = colorValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: ["#64B5F6", "#2196F3"],
        })

        return (
          <Animated.View
            key={emotion.id}
            style={[
              styles.emotionContainer,
              {
                transform: [{ scale: animatedValues[index] }],
                backgroundColor,
              },
            ]}
          >
            <SvgXml xml={emotion.icon} />
            <Text style={styles.emotionLabel}>{emotion.label}</Text>
          </Animated.View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#64B5F6",
    borderRadius: 15,
    padding: 10,
    width: "100%",
    marginVertical: 20,
  },
  emotionContainer: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  emotionLabel: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
})

export default EmotionsSelector
