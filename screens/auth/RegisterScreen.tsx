"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import { almiehappysvg } from "@/indexsvfg"
import MessageBubble from "../../components/common/MessageBubble"
import BackButton from "../../components/common/BackButton"
import colors from "constants/colors"

const RegisterScreen = () => {
  const navigation = useNavigation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      // Mostrar error
      return
    }

    if (password !== confirmPassword) {
      // Mostrar error de contraseñas no coincidentes
      return
    }

    setIsLoading(true)

    // Simulación de registro
    setTimeout(() => {
      setIsLoading(false)
      // Navegar a la pantalla principal
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      })
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
          <MessageBubble message="¡Crea tu cuenta y comienza tu viaje!" />
          <SvgXml xml={almiehappysvg} />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>{isLoading ? "Cargando..." : "Registrarse"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginContainer} onPress={handleBack}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: colors.primaryBlueStrong,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
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

export default RegisterScreen
