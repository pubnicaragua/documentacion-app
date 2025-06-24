"use client";
import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "context/AuthContext";
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
  const [passwordSquares, setPasswordSquares] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [emailStorage, setEmailStorage] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { login, isLoading, error, clearError } = useAuth();

  // Animación de la mano
  const rotation = useSharedValue(0);
  const animatedHandStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1.7 }, { rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    // Configurar animación
    rotation.value = withRepeat(
      withTiming(15, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    // Cargar email guardado y limpiar errores
    loadSavedEmail();
    clearError();
  }, []);

  const loadSavedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("savedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setEmailStorage(true);
      }
    } catch (error) {
      console.log("Error loading saved email:", error);
    }
  };

  const saveEmail = async (emailToSave: string) => {
    try {
      await AsyncStorage.setItem("savedEmail", emailToSave);
    } catch (error) {
      console.log("Error saving email:", error);
    }
  };

  const handlePasswordSquareChange = (text: string, index: number) => {
    const newSquares = [...passwordSquares];
    newSquares[index] = text;
    setPasswordSquares(newSquares);

    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const finalPassword = passwordSquares.join("");

  const handleLogin = async () => {
    if (!email || finalPassword.length < 4) return;

    try {
      await login(email, finalPassword);
      await saveEmail(email);
    } catch (error) {
      console.log("Error capturado en la pantalla:", error);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleApoderado = () => {
    navigation.navigate("LoginApoderado");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangeEmail = () => {
    setEmailStorage(false);
    setEmail("");
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
          {!emailStorage && (
            <TextInput
              style={styles.input}
              placeholder="Correo"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          )}

          <View style={styles.passwordBoxesContainer}>
            {passwordSquares.map((char, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={char}
                onChangeText={(text) => handlePasswordSquareChange(text, index)}
                style={styles.passwordBox}
                maxLength={1}
                secureTextEntry={!showPassword}
                keyboardType="default"
                editable={!isLoading}
              />
            ))}
            <TouchableOpacity
              style={[
                styles.eyeButton,
                { position: "absolute", right: 10, top: 10 },
              ]}
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
              setPasswordSquares(["2", "0", "2", "5"]);
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
          <TouchableOpacity
            style={[
              styles.loginApoderadoButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleApoderado}
          >
            <Text style={styles.loginButtonText}>Apoderado</Text>
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
  passwordBoxesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
    position: "relative",
  },
  passwordBox: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 5,
  },
  eyeButton: {
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
  savedEmailContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savedEmailText: {
    fontSize: 16,
    color: "#333",
  },
  changeEmailButton: {
    padding: 5,
  },
  changeEmailText: {
    color: colors.primaryBlueStrong,
    fontSize: 14,
  },
  animatedhand: {
    position: "absolute",
    right: 65,
    bottom: 50,
  },
   loginApoderadoButton: {
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
});

export default LoginScreen;
