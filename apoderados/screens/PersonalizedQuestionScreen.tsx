import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { RouteParamsPreguntas } from "../data/RouteParamsPreguntas";
import { RespuestaSeleccionada } from "../data/PreguntaConRespuestas";
import { pantallaPregunta } from "../data/PantallaPreguntas";
import { siguientePregunta } from "../services/MotorPreguntasApoderado";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";

interface PersonalizedQuestionScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");

const activityOptions = [
  "Dibujar o hacer manualidades",
  "Jugar videojuegos o ver videos",
  "Estar al aire libre o hacer deporte",
  "Leer cuentos o escuchar historias",
];

export default function PersonalizedQuestionScreen({
  navigation,
}: PersonalizedQuestionScreenProps) {
  const route = useRoute(); // Obtiene los parámetros
  const params = route.params as RouteParamsPreguntas;
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [selectedPregunta, setSelectedPregunta] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tieneRespuesta, setTieneRespuesta] = useState<boolean>(false);
  const [indice, setIndice] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<RespuestaSeleccionada[]>([]);

  const [pregunta, setPregunta] = useState("");
  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    // Funcionalidad para cerrar si es necesaria
    navigation.navigate("Dashboard");
  };

  const selectActivity = (activity: number) => {
    setSelectedActivity(activity);
  };

  const handleContinue = async () => {
    if (!selectedActivity) {
      console.log("Por favor selecciona una actividad");
      return;
    }

    setIsLoading(true);

    try {
      const studentId = await AsyncStorage.getItem("studentId");

      if (!studentId) {
        console.log("Error: ID del estudiante no encontrado");
        return;
      }
      await fetchAuthApi(API_ENDPOINTS.APODERADO_RESPONDER,
        {
          method: "POST",
          body: JSON.stringify({
            alumno_id: parseInt(studentId),
            tipo_pregunta: "actividad_favorita",
            respuesta_posible_id: selectedActivity,
            apoderado_id: 1,
            pregunta_id: selectedPregunta,
          }),
        }
      );

      const indice = params.indice + 1;

      siguientePregunta(
        navigation,
        pantallaPregunta["ConoceHijo"],
        params.preguntas,
        indice
      );
    } catch (error) {
      console.error("Error al guardar respuesta:", error)     
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
      obtenerPreguntas();
  }, [route.params]); // Añade dependencias vacías para evitar bucles

  async function obtenerPreguntas() {
    try {
      const preguntas = params.preguntas;
      const indice_params = params.indice;
      setIndice(indice_params);
      setPregunta(preguntas[indice_params]?.texto_pregunta);
      setSelectedPregunta(preguntas[indice_params]?.pregunta_id);
      setRespuestas(preguntas[indice_params]?.respuestas);
      setTieneRespuesta(true);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con gradiente y controles */}
        <View style={styles.header}>
          <View style={styles.gradientBackground} />

          {/* Botones de navegación */}
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="#334155" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color="#334155" />
            </TouchableOpacity>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
          </View>

          {/* Bocadillo de diálogo */}
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{pregunta}</Text>
            <View style={styles.speechTail} />
          </View>

          {/* Personaje Almie */}
          <View style={styles.almieContainer}>
            <Image
              source={require("../../assets/almis/AlmiePreguntas.png")}
              style={styles.image}
            />
          </View>
        </View>

        {/* Opciones de actividades */}
        <View style={styles.optionsContainer}>
          {respuestas.map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedActivity === activity.respuesta_posible_id &&
                  styles.optionButtonSelected,
              ]}
              onPress={() => selectActivity(activity.respuesta_posible_id)}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedActivity === activity.respuesta_posible_id &&
                    styles.optionTextSelected,
                ]}
              >
                {activity.texto_respuesta}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón Continuar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedActivity || isLoading) && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedActivity || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#333" size="small" />
            ) : (
              <Text
                style={[
                  styles.continueButtonText,
                  !selectedActivity && styles.continueButtonTextDisabled,
                ]}
              >
                Continuar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: height * 0.55,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "85%",
    backgroundColor: "#334155", // Color azul oscuro
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerControls: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    zIndex: 3,
  },
  backButton: {
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
  closeButton: {
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
  progressContainer: {
    position: "absolute",
    top: 80,
    left: 24,
    right: 24,
    zIndex: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#8B7355", // Color más oscuro para mostrar progreso avanzado
    borderRadius: 4,
    width: "85%", // Progreso casi completo
  },
  speechBubble: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
    maxWidth: width * 0.75,
  },
  speechText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
  speechBold: {
    fontWeight: "bold",
  },
  speechTail: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
  },
  almieContainer: {
    position: "relative",
    alignItems: "center",
  },
  almie: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1,
  },
  eyes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  eye: {
    width: 10,
    height: 15,
    backgroundColor: "#000",
    borderRadius: 5,
    marginHorizontal: 3,
  },
  smile: {
    width: 18,
    height: 9,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderRadius: 9,
  },
  leftArm: {
    position: "absolute",
    left: -12,
    top: 18,
    width: 2,
    height: 22,
    backgroundColor: "#000",
    borderRadius: 1,
    transform: [{ rotate: "-30deg" }],
  },
  rightArm: {
    position: "absolute",
    right: -12,
    top: 18,
    width: 2,
    height: 22,
    backgroundColor: "#000",
    borderRadius: 1,
    transform: [{ rotate: "30deg" }],
  },
  rightHand: {
    position: "absolute",
    right: -22,
    top: 15,
  },
  waveEmoji: {
    fontSize: 14,
  },
  feet: {
    flexDirection: "row",
    position: "absolute",
    bottom: -12,
    justifyContent: "center",
  },
  foot: {
    width: 10,
    height: 6,
    backgroundColor: "#000",
    borderRadius: 4,
    marginHorizontal: 1,
  },
  optionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
  },
  optionButton: {
    backgroundColor: "rgba(100, 116, 139, 0.8)", // Color gris azulado como en el diseño
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionButtonSelected: {
    backgroundColor: "rgba(100, 116, 139, 1)",
    borderColor: "#FFC107",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  continueButton: {
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
  continueButtonDisabled: {
    backgroundColor: "rgba(255, 193, 7, 0.3)",
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButtonTextDisabled: {
    color: "rgba(51, 51, 51, 0.5)",
  },
});
