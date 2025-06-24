import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DynamicKeyScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");

export default function DynamicKeyScreen({
  navigation,
}: DynamicKeyScreenProps) {
  const [dynamicKey, setDynamicKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [expiresIn, setExpiresIn] = useState<number>(15);

  useEffect(() => {
    generateDynamicKey();
  }, []);

  const generateDynamicKey = async () => {
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      const studentId = await AsyncStorage.getItem("studentId");

      if (!token) {
        console.log("Sesión expirada. Por favor inicia sesión nuevamente.");
        navigation.navigate("Home");
        return;
      }

      if (!studentId) {
        console.log("Error: ID del estudiante no encontrado");

        return;
      } // TODO: Reemplazar con endpoint real cuando esté implementado
      // const response = await fetch('https://api-almaia.onrender.com/api/v1/alumnos/generar-clave', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     alumno_id: parseInt(studentId),
      //   }),
      // });

      // const responseData = await response.json();

      // if (!response.ok) {
      //   if (response.status === 400) {
      //     toast.error('Datos inválidos para generar la clave.');
      //   } else if (response.status === 401) {
      //     navigation.navigate('Home');
      //     return;
      //   } else if (response.status === 500) {
      //     toast.error('Error del servidor. Intenta más tarde.');
      //   } else {
      //     toast.error(responseData.message || 'Error al generar la clave');
      //   }
      //   return;
      // }

      // setDynamicKey(responseData.clave_dinamica);
      // setExpiresIn(responseData.expira_en_minutos);

      // Por ahora, usar clave simulada como en el diseño
      setDynamicKey("76358");
      setExpiresIn(15);
      console.log("¡Clave dinámica generada exitosamente!");
    } catch (error) {
      console.error("Error al generar clave dinámica:", error);
      console.log(
        "Error de conexión. Verifica tu internet e intenta nuevamente."
      );

      // En caso de error, usar clave simulada
      setDynamicKey("76358");
      setExpiresIn(15);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    // Navegar al Dashboard principal del apoderado
    navigation.navigate("Dashboard");
  };

  const formatKeyDigits = (key: string) => {
    return key.split("").map((digit, index) => (
      <Text key={index} style={styles.keyDigit}>
        {digit}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header con fondo azul y forma curva */}
      <View style={styles.header}>
        <View style={styles.gradientBackground} />

        {/* Ícono centrado */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
        </View>

        {/* Título */}
        <Text style={styles.title}>
          Clave dinámica para la{"\n"}app del menor
        </Text>

        {/* Código dinámico */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" size="large" />
          </View>
        ) : (
          <View style={styles.keyContainer}>{formatKeyDigits(dynamicKey)}</View>
        )}

        {/* Texto instructivo */}
        <Text style={styles.instructionText}>
          Ingresa este código en la app de AlmaIA Niños,{"\n"}
          para que este pueda ingresar a su cuenta.
        </Text>
      </View>

      {/* Área blanca inferior */}
      <View style={styles.bottomArea}>
        {!isLoading && expiresIn && (
          <Text style={styles.expirationText}>
            Este código expira en {expiresIn} minutos
          </Text>
        )}

        {/* Botón Continuar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isLoading && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#333" size="small" />
            ) : (
              <Text style={styles.continueButtonText}>Continuar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: height * 0.75,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "90%",
    backgroundColor: "#334155", // Color azul oscuro
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 30,
    zIndex: 1,
  },
  loadingContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  keyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    zIndex: 1,
  },
  keyDigit: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instructionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  bottomArea: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 40,
  },
  expirationText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonContainer: {
    marginTop: "auto",
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
    backgroundColor: "#FFE082",
    shadowOpacity: 0.1,
  },
  continueButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
