"use client"

import { useEffect, useRef } from "react"
import { StyleSheet, View, Animated } from "react-native"

interface ProgressBarProps {
  progress: number // 0 a 1
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progress, { width }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: "#64B5F6",
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
})

export default ProgressBar
