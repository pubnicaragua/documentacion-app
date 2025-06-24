import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

interface ConsentScreenProps {
  navigation: any;
}

export default function ConsentScreen({ navigation }: ConsentScreenProps) {
  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = async () => {
    if (!consentAccepted) {
      console.log( "Debes aceptar el consentimiento para continuar");
      return;
    }

    try {
      const token = (await AsyncStorage.getItem("authToken")) || "demo-token";
      const alumno_id = await AsyncStorage.getItem("studentId");
      // Guardar consentimiento en AsyncStorage
      await AsyncStorage.setItem("consentimiento_apoderado", "true");
      const response = await fetch(
        "https://api-almaia.onrender.com/api/v1/alumnos/consentimiento/" +
          alumno_id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            consentimiento: consentAccepted,
          }),
        }
      );
      console.log("Consentimiento registrado");
      // Navegar a la siguiente pantalla (Intro gustos del menor)
       navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "AlumnoFlow",
            state: {
              routes: [{ name: "IntroTastes" }],
            },
          },
        ],
      })
    );
    } catch (error) {
      console.error("Error al guardar consentimiento:", error);     
    }
  };

  const toggleConsent = () => {
    setConsentAccepted(!consentAccepted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {" "}
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileImageButton}>
            <Ionicons name="image-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerSpacer} />
        </View>
        {/* Título */}
        <Text style={styles.title}>Consentimiento y{"\n"}asentimiento</Text>
        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar} />
        </View>
        {/* Contenido */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Para poder brindarle a tu hijo una experiencia personalizada y
            segura dentro de AlmaIA, necesitamos tu consentimiento como padre,
            madre o tutor legal.
          </Text>

          <Text style={styles.paragraph}>
            Esto nos autoriza a recopilar y utilizar información relacionada con
            sus gustos, intereses y preferencias, siempre con fines educativos y
            de mejora de la experiencia.
          </Text>

          <Text style={styles.paragraph}>
            Ambos acuerdos son fundamentales para asegurar una experiencia
            respetuosa, consciente y alineada con el bienestar del menor.
          </Text>

          {/* Checkbox de consentimiento */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={toggleConsent}
          >
            <View
              style={[
                styles.checkbox,
                consentAccepted && styles.checkboxChecked,
              ]}
            >
              {consentAccepted && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Acepto el consentimiento y asentimiento.
            </Text>
          </TouchableOpacity>
        </View>
        {/* Botón Continuar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !consentAccepted && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!consentAccepted}
          >
            <Text
              style={[
                styles.continueButtonText,
                !consentAccepted && styles.continueButtonTextDisabled,
              ]}
            >
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#334155",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerSpacer: {
    width: 40,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageButton: {
    position: "absolute",
    left: "50%",
    marginLeft: -20,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 30,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#FFC107",
    borderRadius: 4,
    width: "80%", // Progreso aumentado para la tercera pantalla
  },
  content: {
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  paragraph: {
    fontSize: 16,
    color: "#E2E8F0",
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "left",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#FFC107",
    borderColor: "#FFC107",
  },
  checkboxText: {
    fontSize: 16,
    color: "#E2E8F0",
    flex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
