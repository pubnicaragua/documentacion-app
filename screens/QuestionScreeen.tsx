import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { almiSaludosvg } from "indexsvfg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteParamsPreguntas } from "data/RouteParamsPreguntas";
import { siguientePregunta } from "service/MotorPreguntasService";
import { useAuth } from "context/AuthContext";
import { fetchAuthApi, API_ENDPOINTS } from "config/api";
import { pantallaPregunta } from "data/PantallaPreguntas";

const { width, height } = Dimensions.get('window');

const PandaCharacter = ({ question }) => (
  <View style={styles.pandaContainer}>
    <SvgXml xml={almiSaludosvg} height={70} width={70} />
    
    {/* Speech bubble */}
    <View style={styles.speechBubble}>
      <Text style={styles.speechText}>{question}</Text>
      <View style={styles.speechTail} />
    </View>
  </View>
);

const QuestionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const params = route.params as RouteParamsPreguntas;
  const [pregunta, setPregunta] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [indice, setIndice] = useState<number>(0);
  const [tieneRespuesta, setTieneRespuesta] = useState<boolean>(false);
  const [preguntaId, setPreguntaId] = useState(0);
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);

  async function obtenerPreguntas() {
    try {
      const preguntas = params.preguntas;
      const indice_params = params.indice;
      setIndice(indice_params);
      setPregunta(preguntas[indice_params]?.texto_pregunta);
      setPreguntaId(preguntas[indice_params]?.pregunta_id);
      
      // Map the answers to options array
      const respuestas = preguntas[indice_params].respuestas.map(resp => resp.texto_respuesta);
      setOptions(respuestas);
      
      // Calculate progress
      setProgress((indice_params + 1) / preguntas.length);
      
      setTieneRespuesta(true);
    } catch (error) {
      console.error("Error obteniendo preguntas:", error);
    }
  }

  useEffect(() => {
    if (!tieneRespuesta) {
      obtenerPreguntas();
    }
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.navigate("MainTabs");
  };

  const handleContinue = async () => {
    if (selectedOption !== null) {
      // Get the selected answer ID from the original respuestas array
      const selectedAnswerId = params.preguntas[indice].respuestas[selectedOption].respuesta_posible_id;
     await fetchAuthApi(API_ENDPOINTS.GUARDARESPUESTA, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
              alumno_id: user?.alumno_id,
              pregunta_id: preguntaId,
              respuesta_posible_id: selectedAnswerId, // reemplaza con valor real
            }),
            });
      const nextIndex = indice + 1;
      siguientePregunta(
        navigation,
        pantallaPregunta[params.preguntas[nextIndex]?.template_code],
        params.preguntas,
        nextIndex
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#87CEEB', '#4A90E2', '#2E86AB']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Text style={styles.headerButtonText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
            <Text style={styles.headerButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Panda character with question */}
        <PandaCharacter question={pregunta} />

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && styles.selectedOption
              ]}
              onPress={() => setSelectedOption(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            selectedOption === null && styles.continueButtonDisabled
          ]}
          disabled={selectedOption === null}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>

        {/* Home indicator */}
        <View style={styles.homeIndicator} />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  pandaContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginLeft: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speechText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  speechTail: {
    position: 'absolute',
    left: -8,
    top: 20,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderRightWidth: 15,
    borderRightColor: 'white',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 15,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'white',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#0066CC',
    borderRadius: 25,
    paddingVertical: 18,
    marginTop: 30,
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(0, 102, 204, 0.5)',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default QuestionScreen;