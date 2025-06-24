import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { almiehello, bubblehello, animatedHandsvg } from "@/indexsvfg";
import { SvgXml } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAuth } from "context/AuthContext";
interface LoginScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");

export default function LoginApoderadoScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginApoderado, isLoading, error, clearError } = useAuth();

  const rotation = useSharedValue(0);

  const animatedHandStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1.7 }, { rotate: `${rotation.value}deg` }],
    };
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRealLogin = async () => {
    // Validaciones básicas
    if (!email.trim()) {
      console.log("Por favor ingresa tu correo electrónico");

      return;
    }

    if (!validateEmail(email)) {
      console.log("Por favor ingresa un correo electrónico válido");
      return;
    }

    if (!password.trim()) {
      console.log("Por favor ingresa tu contraseña");
      return;
    }

    if (password.length < 6) {
      console.log("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      loginApoderado(email.toLowerCase().trim(), password);
    } catch (error: any) {
      console.error("Error durante el login real:", error);
    } finally {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header con gradiente y personaje Almie */}
          <View style={styles.header}>
            <View style={styles.gradientBackground} />

            {/* Personaje Almie */}
            <View style={styles.almieContainer}>
              <SvgXml
                xml={bubblehello}
                style={{ transform: [{ scale: 1.5 }], marginBottom: 60 }}
              />
              <SvgXml
                xml={almiehello}
                style={{ transform: [{ scale: 1.5 }], marginRight: 45 }}
              />
              <Animated.View style={[styles.animatedhand, animatedHandStyle]}>
                <SvgXml xml={animatedHandsvg} />
              </Animated.View>
            </View>
          </View>{" "}
          {/* Formulario */}
          <View style={styles.form}>
            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                editable={!isLoading}
              />
            </View>{" "}
            {/* Credenciales de demo */}
            <TouchableOpacity
              style={styles.demoCredentialsContainer}
              onPress={() => {
                setEmail("sandra.fernandez@email.com");
                setPassword("almaia2025");
              }}
            >
              <Text style={styles.demoCredentialsText}>
                📋 Usar credenciales de demo
              </Text>
            </TouchableOpacity>
            {/* Link olvidar contraseña */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => {
                navigation.navigate("ChangePassword");
              }}
            >
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>
          {/* Botones de Login */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.realLoginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleRealLogin}
              disabled={isLoading}
            >
              <Text style={styles.realLoginButtonText}>Iniciar sesion</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: "#334155", // Color azul oscuro similar al diseño
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
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
    marginTop: 80,
    marginBottom: 20,
  },
  almie: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    marginBottom: 8,
  },
  eye: {
    width: 12,
    height: 18,
    backgroundColor: "#000",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  smile: {
    width: 20,
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderRadius: 10,
  },
  leftArm: {
    position: "absolute",
    left: -15,
    top: 20,
    width: 3,
    height: 25,
    backgroundColor: "#000",
    borderRadius: 2,
    transform: [{ rotate: "-30deg" }],
  },
  rightArm: {
    position: "absolute",
    right: -15,
    top: 20,
    width: 3,
    height: 25,
    backgroundColor: "#000",
    borderRadius: 2,
    transform: [{ rotate: "30deg" }],
  },
  rightHand: {
    position: "absolute",
    right: -28,
    top: 15,
  },
  waveEmoji: {
    fontSize: 16,
  },
  feet: {
    flexDirection: "row",
    position: "absolute",
    bottom: -15,
    justifyContent: "center",
  },
  foot: {
    width: 12,
    height: 8,
    backgroundColor: "#000",
    borderRadius: 6,
    marginHorizontal: 2,
  },
  form: {
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
  },
  connectionWarning: {
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFEAA7",
  },
  connectionWarningText: {
    color: "#856404",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  demoCredentialsContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  demoCredentialsText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "500",
  },
  quickNavContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F0F4F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  quickNavTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12,
    textAlign: "center",
  },
  quickNavButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  quickNavButton: {
    flex: 1,
    backgroundColor: "#334155",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  quickNavButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 12,
  },
  loginButton: {
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
  realLoginButton: {
    backgroundColor: "#FFCB3C",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E4BB4CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  realLoginButtonText: {
    color: "#181818",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  animatedhand: {
    position: "absolute",
    right: -28,
    bottom: 50,
  },
});
