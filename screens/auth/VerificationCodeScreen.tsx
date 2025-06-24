"use client"

import { useState, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const VerificationCodeScreen = () => {
  const navigation = useNavigation()
  const [code, setCode] = useState(["", "", "", "", ""])
  const inputRefs = useRef<Array<TextInput | null>>([])

  // Función para manejar el cambio en los inputs del código
  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code]
    newCode[index] = text

    setCode(newCode)

    // Si se ingresó un dígito y no es el último input, mover al siguiente
    if (text.length === 1 && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Función para manejar la tecla de borrar
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Función para continuar
  const handleContinue = () => {
    const verificationCode = code.join("")
    console.log("Código de verificación:", verificationCode)
    // Navegar a la pantalla de completar perfil
    navigation.navigate("CompleteProfile")
  }

  // Función para reenviar el código
  const handleResendCode = () => {
    console.log("Reenviar código")
    // Aquí iría la lógica para reenviar el código
  }

  // Función para volver a la pantalla anterior
  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
          </View>

          <Text style={styles.title}>Código de Verificación</Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <Text style={styles.instructions}>
            Se envió un código de verificación a tu teléfono. Ingresa el código para continuar
          </Text>

          <TouchableOpacity style={styles.resendContainer} onPress={handleResendCode}>
            <Text style={styles.resendText}>¿No has recibido el código de verificación?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9D4FB",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  instructions: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
    color: "white",
    textDecorationLine: "underline",
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: "#2196F3",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default VerificationCodeScreen
