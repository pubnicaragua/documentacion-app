"use client";

import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackButton from "../components/common/BackButton";
import CloseButton from "../components/common/CloseButton";
import ProgressBar from "../components/common/ProgressBar";
import EmotionTypeSelector from "../components/emotion-detail/EmotionTypeSelector";
import EmotionGrid from "../components/emotion-detail/EmotionGrid";
import ContinueButton from "../components/common/ContinueButton";
import { RouteParamsPreguntas } from "alumnos/data/RouteParamsPreguntas";
import { siguientePregunta } from "alumnos/service/MotorPreguntasService";
import { pantallaPregunta } from "alumnos/data/PantallaPreguntas";
import { RespuestaPosible } from "alumnos/data/RespuestaPosible";
import { fetchAuthApi, API_ENDPOINTS } from "config/api";
import { useAuth } from "context/AuthContext";;

const EmotionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [selectedType, setSelectedType] = useState("positive");
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const params = route.params as RouteParamsPreguntas; // Tipado en TypeScript
  const [pregunta, setPregunta] = useState("");
  const [preguntaId, setPreguntaId] = useState(0);

  const [indice, setIndice] = useState<number>(0);
  const [tieneRespuesta, setTieneRespuesta] = useState<boolean>(false);
    const { user } = useAuth();
  
  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.navigate("MainTabs");
  };

  const handleContinue = async () => {
     await fetchAuthApi(API_ENDPOINTS.GUARDARESPUESTA, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
              alumno_id: user?.alumno_id,
              pregunta_id: preguntaId,
              respuesta_posible_id: selectedEmotion, // reemplaza con valor real
            }),
            });
    if (selectedEmotion) {
      const indice =params.indice+1
      siguientePregunta(navigation,pantallaPregunta[params.preguntas[indice]?.template_code],params.preguntas,indice)
    }
  };

  const positiveEmotions:RespuestaPosible[] = [
  { respuesta_posible_id: 25, nombre: "Feliz" },
  { respuesta_posible_id: 26, nombre: "Emocionado" },
  { respuesta_posible_id: 27, nombre: "Tranquilo" },
  { respuesta_posible_id: 28, nombre: "Orgulloso" },
  { respuesta_posible_id: 29, nombre: "Agradecido" },
  { respuesta_posible_id: 30, nombre: "Curioso" },
  { respuesta_posible_id: 31, nombre: "Motivado" },
  { respuesta_posible_id: 32, nombre: "Amado" },
  { respuesta_posible_id: 33, nombre: "Divertido" },
  { respuesta_posible_id: 34, nombre: "En paz" },
];

  const negativeEmotions:RespuestaPosible[] = [
  { respuesta_posible_id: 35, nombre: "Triste" },
  { respuesta_posible_id: 36, nombre: "Enojado" },
  { respuesta_posible_id: 37, nombre: "Ansioso" },
  { respuesta_posible_id: 38, nombre: "Frustrado" },
  { respuesta_posible_id: 39, nombre: "Cansado" },
  { respuesta_posible_id: 40, nombre: "Confundido" },
  { respuesta_posible_id: 41, nombre: "Preocupado" },
  { respuesta_posible_id: 42, nombre: "Decepcionado" },
  { respuesta_posible_id: 43, nombre: "Abrumado" },
  { respuesta_posible_id: 44, nombre: "Inseguro" },
];

  const emotions =
    selectedType === "positive" ? positiveEmotions : negativeEmotions;
  async function obtenerPreguntas() {
    try {
      const preguntas = params.preguntas;
      const indice_params = params.indice;
      setIndice(indice_params);
      setPregunta(preguntas[indice_params]?.texto_pregunta);
      setPreguntaId(preguntas[indice_params]?.pregunta_id);
      setTieneRespuesta(true);
    } catch (error) {}
  }
  useEffect(() => {
    if (!tieneRespuesta) {
      obtenerPreguntas();
    }
  }, []); // Añade dependencias vacías para evitar bucles

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <CloseButton onPress={handleClose} />
      </View>

      <ProgressBar progress={0.25} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{pregunta}</Text>

        <EmotionTypeSelector
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />

        <EmotionGrid
          emotions={emotions}
          selectedEmotion={selectedEmotion}
          onSelectEmotion={setSelectedEmotion}
        />
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton onPress={handleContinue} disabled={!selectedEmotion} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9D4FB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 40, // Para dar espacio a la barra de estado
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginVertical: 20,
  },
  footer: {
    padding: 20,
  },
});

export default EmotionDetailScreen;
