"use client";

import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackButton from "../components/common/BackButton";
import CloseButton from "../components/common/CloseButton";
import ProgressBar from "../components/common/ProgressBar";
import ContinueButton from "../components/common/ContinueButton";
import { fetchAuthApi, API_ENDPOINTS } from "config/api";
import { useAuth } from "context/AuthContext";

const DiaryEntryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryText, setDiaryText] = useState("");
  const [wantsToAnswer, setWantsToAnswer] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };
  const { user } = useAuth();

  const handleClose = () => {
    navigation.navigate("MainTabs");
  };

  const handleContinue = async () => {

   if (diaryTitle.length ===0 ||diaryText.length===0) {
      handleSkip()
    }else{
      await fetchAuthApi(API_ENDPOINTS.DIARIO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alumno_id: user?.alumno_id,
          titulo: diaryTitle,
          descripcion: diaryText, // reemplaza con valor real
          fecha: new Date().toISOString(), // ejemplo de fecha actual
        }),
      });
      navigation.navigate("ThankYou", {
        selectedMood: route.params?.selectedMood,
        selectedEmotion: route.params?.selectedEmotion,
        emotionType: route.params?.emotionType,
        selectedActivities: route.params?.selectedActivities,
        diaryText,
      });
    }
  };
  const handleSkip = () => {
    navigation.navigate("ThankYou", {
      selectedMood: route.params?.selectedMood,
      selectedEmotion: route.params?.selectedEmotion,
      emotionType: route.params?.emotionType,
      selectedActivities: route.params?.selectedActivities,
      diaryText,
    });
  };
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={handleBack} />
          <CloseButton onPress={handleClose} />
        </View>

        <ProgressBar progress={0.75} />

        <View style={styles.content}>
          <Text style={styles.title}>¿Deseas agregar algo a tu diario?</Text>
                    <Text style={styles.subTitle}>Opcional</Text>
          
          <View style={styles.diaryContainerTitle}>
                <TextInput
                  style={styles.diaryInputTitle}
                  value={diaryTitle}
                  onChangeText={setDiaryTitle}
                  maxLength={50}
                  placeholder="Título del diario, Ej: Un día difícil en la escuela"
                  textAlignVertical="top"
                />
                <View style={styles.diaryFooter}>
                  <Text style={styles.charCount}>{diaryTitle.length}/50</Text>
                </View>
              </View>

              <View style={styles.diaryContainer}>
                <TextInput
                  style={styles.diaryInput}
                  multiline
                  value={diaryText}
                  onChangeText={setDiaryText}
                  maxLength={1000}
                  textAlignVertical="top"
                  placeholder="Descripcion del diario, Ej: Hoy me sentí frustrado porque no entendí la clase de matemáticas. Me ayudó hablar con un amigo y ahora me siento un poco mejor."

                />
                <View style={styles.diaryFooter}>
                  <Text style={styles.charCount}>{diaryText.length}/1000</Text>
                </View>
              </View>
        </View>

        <View style={styles.footer}>
          <ContinueButton onPress={handleContinue} />
          
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#A9D4FB",
  },
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
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginVertical: 20,
  },
  diaryContainer: {
    backgroundColor: "#64B5F6",
    borderRadius: 15,
    padding: 15,
    flex: 1,
    marginBottom: 20,
  },
  diaryContainerTitle: {
    backgroundColor: "#64B5F6",
    borderRadius: 15,
    padding: 15,
    flex: 0.17,
    marginBottom: 5,
  },
  diaryInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    lineHeight: 24,
  },
  diaryInputTitle: {
    color: "white",
    fontSize: 14, // antes 16
    lineHeight: 18, // más acorde al tamaño
    height: 40, // puedes ajustar según necesites
  },
  diaryFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: -10,
  },
  charCount: {
    color: "white",
    fontSize: 14,
  },
  footer: {
    padding: 20,
  },
  orText: {
    textAlign: "center",
    color: "white",
    marginVertical: 8,
    fontSize: 16,
  },

  skipButtonContainer: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)", // semitransparente para contraste
  },

  skipButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10,
    backgroundColor: "transparent",
  },
subTitle:{
    color: "#78859493",
},
  checkboxChecked: {
    backgroundColor: "#ffffff",
  },

  checkboxLabel: {
    fontSize: 16,
    color: "white",
  },
});

export default DiaryEntryScreen;
