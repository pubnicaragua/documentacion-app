import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAuthApi, API_ENDPOINTS } from "config/api";

interface SOSScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");

export default function SOSScreen({ navigation }: SOSScreenProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const maxLength = 1000;

  const handleClose = () => {
    navigation.goBack();
  };

  const validateMessage = () => {
    if (!message.trim()) {

      return false;
    }

    if (message.trim().length < 10) {
      return false;
    }

    return true;
  };
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
    console.log(validateMessage());

    if (!validateMessage()) return;

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      const studentId = await AsyncStorage.getItem("studentId");

      if (!token) {
        navigation.navigate("Home");
        return;
      }

      if (!studentId) {
        return;
      }
      await fetchAuthApi(API_ENDPOINTS.ALERTA, {
        method: "POST",
        body: JSON.stringify({
          alumno_id: parseInt(studentId),
          mensaje: message.trim(),
          fecha_generada: generarFechaLocal(),
          alerta_origen_id: 1,
          prioridad_id: 3,
          severidad_id: 3,
          leida: false,
          estado: "pendiente",
          alertas_tipo_alerta_tipo_id: 1,
        }),
      });
      navigation.navigate("Dashboard");

    } catch (error) {
      console.error("Error al enviar alerta emocional:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingChars = maxLength - message.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Header con fondo azul y forma curva */}
        <View style={styles.header}>
          <View style={styles.gradientBackground} />

          {/* Título y botón cerrar */}
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              <Text style={styles.titleBold}>SOS</Text> Alma
            </Text>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color="#334155" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido principal */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Pregunta principal */}
          <Text style={styles.questionText}>
            ¿Quieres agregar alguna información que afecte la emocionalidad de
            tu hijo?
          </Text>

          {/* Campo de texto con ejemplo */}
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              multiline={true}
              numberOfLines={10}
              placeholder="(Ejemplo): 'Muerte de familiar: Hace poco falleció mi padre, y mi hijo está afectado por la muerte de su abuelo, esto puede hacer que se sienta bastante triste, a diferencia de lo alegre que se le ve de normal.'"
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              maxLength={maxLength}
              textAlignVertical="top"
              editable={!isLoading}
            />

            {/* Contador de caracteres */}
            <View style={styles.charCounter}>
              <Text style={styles.charCounterText}>
                {remainingChars}/{maxLength}
              </Text>
            </View>
          </View>

          {/* Nota explicativa */}
          <Text style={styles.noteText}>
            * Puedes contarle algo que consideres importante que pueda afectar
            la emocionalidad de tu hijo.
          </Text>
        </ScrollView>

        {/* Botón Enviar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#333" size="small" />
            ) : (
              <Text
                style={[
                  styles.sendButtonText,
                  !message.trim() && styles.sendButtonTextDisabled,
                ]}
              >
                Enviar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    height: 120,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "85%",
    backgroundColor: "#334155", // Color azul oscuro
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 2,
    width: "100%",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  titleBold: {
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  questionText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: "500",
  },
  textAreaContainer: {
    backgroundColor: "#64748B", // Color gris azulado como en el diseño
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    position: "relative",
    minHeight: 200,
  },
  textArea: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
    minHeight: 150,
    textAlignVertical: "top",
  },
  charCounter: {
    position: "absolute",
    bottom: 12,
    right: 16,
  },
  charCounterText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
    marginBottom: 40,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  sendButton: {
    backgroundColor: "#FFC107",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(255, 193, 7, 0.3)",
    shadowOpacity: 0,
  },
  sendButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  sendButtonTextDisabled: {
    color: "rgba(51, 51, 51, 0.5)",
  },
});
