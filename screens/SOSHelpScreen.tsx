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
import { API_ENDPOINTS, fetchAuthApi } from "config/api"
import { useAuth } from "context/AuthContext"
import { almimascotsvg } from "indexsvfg"
import { useToast } from "context/ToastContext"

const SOSHelpScreen = () => {
  const navigation = useNavigation()
  const [message, setMessage] = useState("")
  const {  user } = useAuth();
  const { showToast } = useToast()
const generarFechaLocal = () => {  
  const now = new Date();  
    
  // Opción simple: usar toLocaleString con formato ISO  
  return now.toLocaleString('sv-SE', {  
    year: 'numeric',  
    month: '2-digit',  
    day: '2-digit',  
    hour: '2-digit',  
    minute: '2-digit',  
    second: '2-digit',  
    hour12: false  
  }).replace(' ', 'T') + 'Z'; // Agregar 'T' y 'Z' si necesitas formato ISO  
}; 
  const handleSend = async () => {
    // Aquí iría la lógica para enviar el mensaje
     await fetchAuthApi(API_ENDPOINTS.ALERTA, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          alumno_id: user?.alumno_id,
          mensaje: message,
          fecha_generada:generarFechaLocal(), // ejemplo de fecha actual
          alerta_origen_id: 1, // reemplaza con valor real
          prioridad_id: 3, // reemplaza con valor real
          severidad_id: 3, // reemplaza con valor real
          leida: false,
          estado: "pendiente",
          alertas_tipo_alerta_tipo_id: 1, // reemplaza con valor real
        }),
        });
     showToast("Se ha enviado SOS correctamente.", "success")
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF4757" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={styles.sosText}>SOS</Text> Alma
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.messageContainer}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>¿Que quieres contarme?</Text>
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
                placeholderTextColor="#FF475780"
                multiline
                value={message}
                onChangeText={setMessage}
                maxLength={1000}
              />
              <Text style={styles.counter}>{message.length}/1000</Text>
            </View>
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
    backgroundColor: "#FF4757",
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
  sosText: {
    fontWeight: "900",
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
    color: "#FF4757",
    fontSize: 16,
    textAlignVertical: "top",
    height: 180,
  },
  counter: {
    color: "#FF4757",
    textAlign: "right",
    marginTop: 5,
  },
  sendButton: {
    backgroundColor: "#FF4757",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: "auto",
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default SOSHelpScreen


