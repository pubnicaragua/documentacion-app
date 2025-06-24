"use client";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useAuth } from "context/AuthContext";;
import { useNavigation } from "@react-navigation/native";
import { almiehello, bubblehello, animatedHandsvg } from "@/indexsvfg";
import { SvgXml } from "react-native-svg";
import colors from "constants/colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
  }, []);

  // Animación de la mano
  const rotation = useSharedValue(0);

  const animatedHandStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1.7 }, { rotate: `${rotation.value}deg` }],
    };
  });

  // Iniciar animación cuando el componente se monta
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(15, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1, // Repetir infinitamente
      true // Reversar la animación
    );
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      // No usamos Alert aquí, el sistema de toast se encargará de mostrar errores
      return;
    }

    try {
      await login(email, password);
      // La navegación se manejará automáticamente en App.tsx basado en el estado del usuario
    } catch (error) {
      // Los errores ya se manejan en el contexto y se muestran a través del sistema de toast
      console.log("Error capturado en la pantalla:", error);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mascotContainer}>
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

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={togglePasswordVisibility}
              disabled={isLoading}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: colors.secondaryBlue || "#4a90e2" },
            ]}
            onPress={() => {
              setEmail("valentina.morales2@email.com");
              setPassword("almaia2025");
            }}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>Usuario Demo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  mascotContainer: {
    position: "relative",
    alignItems: "center",
    marginTop: 80,
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 15,
  },
  passwordInput: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    paddingRight: 50, // Espacio para el botón de ojo
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 5,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "#333",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.primaryBlueStrong,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    alignItems: "center",
  },
  registerText: {
    color: "#333",
    fontSize: 14,
  },
  animatedhand: {
    position: "absolute",
    right: 65,
    bottom: 50,
  },
});

export default LoginScreen;
