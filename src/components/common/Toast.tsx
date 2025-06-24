"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { StyleSheet, View, Text, Animated, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"

interface ToastProps {
  visible: boolean
  message: string
  type: "success" | "error" | "info"
  onDismiss: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ visible, message, type, onDismiss, duration = 3000 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateYAnim = useRef(new Animated.Value(-20)).current

  useEffect(() => {
    if (visible) {
      // Mostrar el toast
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Ocultar el toast después de la duración especificada
      const timer = setTimeout(() => {
        hideToast()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss()
    })
  }

  if (!visible) return null

  const getIconName = () => {
    switch (type) {
      case "success":
        return "check-circle"
      case "error":
        return "alert-circle"
      case "info":
        return "info"
      default:
        return "info"
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50"
      case "error":
        return "#F44336"
      case "info":
        return "#2196F3"
      default:
        return "#2196F3"
    }
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Feather name={getIconName()} size={24} color="white" style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
        <Feather name="x" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    marginLeft: 12,
  },
})

export default Toast
