"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import { almiehappysvg } from "@/indexsvfg"
import MessageBubble from "../../components/common/MessageBubble"
import BackButton from "../../components/common/BackButton"
import colors from "constants/colors"

const ForgotPasswordScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleResetPassword = () => {
    if (!email) {
      // Mostrar error
      return
    }

    setIsLoading(true)

    // Simulación de envío de correo
    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
      Alert.alert("Correo enviado", "Se ha enviado un correo con instrucciones para restablecer tu contraseña.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    }, 1500)
  }

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mascotContainer}>
          <MessageBubble message="¿Olvidaste tu contraseña? ¡No te preocupes!" />
          <SvgXml xml={almiehappysvg} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.instructionText}>
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSent}
          />

          <TouchableOpacity
            style={[styles.resetButton, (isLoading || isSent) && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading || isSent}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? "Enviando..." : isSent ? "Correo enviado" : "Restablecer contraseña"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginContainer} onPress={handleBack}>
            <Text style={styles.loginText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  mascotContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 20,
  },
  mascotImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  instructionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: colors.primaryBlueStrong,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    alignItems: "center",
  },
  loginText: {
    color: "#333",
    fontSize: 14,
  },
})

export default ForgotPasswordScreen
