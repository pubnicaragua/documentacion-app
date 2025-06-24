"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { almisossvg } from "@/indexsvfg"
import { fetchAuthApi, API_ENDPOINTS } from "config/api"
import { useAuth } from "context/AuthContext"
import { almimascotsvg } from "indexsvfg"
import { useToast } from "context/ToastContext"

const SOSReportScreen = () => {
  const navigation = useNavigation()
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const { user } = useAuth()
  const { showToast } = useToast()

  const generarFechaLocal = () => {  
    const now = new Date()  
      
    // Opción simple: usar toLocaleString con formato ISO  
    return now.toLocaleString('sv-SE', {  
      year: 'numeric',  
      month: '2-digit',  
      day: '2-digit',  
      hour: '2-digit',  
      minute: '2-digit',  
      second: '2-digit',  
      hour12: false  
    }).replace(' ', 'T') + 'Z' // Agregar 'T' y 'Z' si necesitas formato ISO  
  }

  const handleSend = async () => {
    try {
      await fetchAuthApi(API_ENDPOINTS.ALERTA, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alumno_id: isAnonymous ? null : user?.alumno_id,
          mensaje: message,
          fecha_generada: generarFechaLocal(),
          alerta_origen_id: 1,
          prioridad_id: 2,
          severidad_id: 2,
          leida: false,
          estado: "pendiente",
          alertas_tipo_alerta_tipo_id: 2,
          anonimo: isAnonymous // Agregamos este campo para indicar si es anónimo
        }),
      })
      showToast("Se ha enviado la denuncia correctamente.", "success")
      navigation.goBack()
    } catch (error) {
      showToast("Error al enviar la denuncia.", "error")
      console.error("Error sending report:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#5F399F" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Denuncia</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.messageContainer}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>¿Qué quieres contarme?</Text>
            </View>
            <View style={styles.mascotContainer}>
              <SvgXml xml={almimascotsvg} width={120} height={120} />
            </View>
          </View>

          <View style={styles.wavyBackground} />

          <View style={styles.whiteBubble}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Escribe algo..."
                placeholderTextColor="#5F399F80"
                multiline
                value={message}
                onChangeText={setMessage}
                maxLength={1000}
              />
              <Text style={styles.counter}>{message.length}/1000</Text>
            </View>

            <TouchableOpacity 
              style={styles.anonymousContainer} 
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              <View style={[styles.checkbox, isAnonymous && styles.checkboxChecked]}>
                {isAnonymous && <Ionicons name="checkmark" size={20} color="#5F399F" />}
              </View>
              <Text style={styles.anonymousText}>Enviar como anónimo</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5F399F",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    position: "relative",
  },
  headerTitle: {
    fontSize: 24,
    color: "white",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  messageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  bubble: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    maxWidth: "80%",
  },
  bubbleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  mascotContainer: {
    marginTop: -10,
  },
  wavyBackground: {
    height: 50,
    backgroundColor: "white",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    marginTop: 20,
  },
  whiteBubble: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    padding: 5,
  },
  inputContainer: {
    backgroundColor: "#F0F0F0",
    margin: 15,
    borderRadius: 15,
    padding: 15,
    minHeight: 200,
  },
  textInput: {
    color: "#5F399F",
    fontSize: 16,
    textAlignVertical: "top",
    height: 180,
  },
  counter: {
    color: "#5F399F",
    textAlign: "right",
    marginTop: 5,
  },
  anonymousContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#5F399F",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#5F399F",
  },
  anonymousText: {
    color: "#5F399F",
    fontSize: 16,
    fontWeight: "500",
  },
  sendButton: {
    backgroundColor: "#5F399F",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: "auto",
    borderWidth: 2,
    borderColor: "white",
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default SOSReportScreen