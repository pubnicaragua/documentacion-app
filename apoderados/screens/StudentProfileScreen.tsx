import React, { useEffect, useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAuthApi, API_ENDPOINTS } from "config/api";

interface StudentProfileScreenProps {
  navigation: any;
}

export default function StudentProfileScreen({
  navigation,
}: StudentProfileScreenProps) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    rut: "",
    email: "",
    password: "",
    telefono_contacto: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [usuarioId, setUsuarioId] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "nombres",
      "apellidos",
      "fecha_nacimiento",
      "rut",
      "email",
      "telefono_contacto",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        const fieldNames: Record<string, string> = {
          nombre_completo: "nombre completo",
          fecha_nacimiento: "fecha de nacimiento",
          rut: "RUT",
          email: "email",
          password: "contraseña",
          telefono_contacto: "teléfono",
        };
        console.log(`Por favor completa el campo ${fieldNames[field]}`);
        return false;
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log("Por favor ingresa un correo electrónico válido");
      return false;
    }

    // Validar teléfono (formato chileno básico)
    const phoneRegex = /^(\+56)?[0-9]{8,9}$/;
    if (!phoneRegex.test(formData.telefono_contacto.replace(/\s/g, ""))) {
      console.log("Por favor ingresa un número de teléfono válido");
      return false;
    }

    // Validar fecha de nacimiento (formato DD/MM/YYYY o DD-MM-YYYY)
    const dateRegex = /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/;
    if (!dateRegex.test(formData.fecha_nacimiento)) {
      console.log("Por favor ingresa la fecha en formato DD/MM/YYYY");
      return false;
    }

    // Validar RUT chileno básico
    /*  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    if (!rutRegex.test(formData.rut)) {
      console.log('Por favor ingresa un RUT válido (ej: 12.345.678-9)');
      
      toast.error('Por favor ingresa un RUT válido (ej: 12.345.678-9)');
      return false;
    }*/

    return true;
  };
  useEffect(() => {
    obtenerAlumno();
  }, []);
  const obtenerAlumno = async () => {
    const token = await AsyncStorage.getItem("authToken"); // Permitir navegación sin token para pruebas
    const alumnoId = await AsyncStorage.getItem("studentId"); // Permitir navegación sin token para pruebas
    const responsePerfil =  await fetchAuthApi(API_ENDPOINTS.ALUMNO+'?alumno_id='+alumnoId, { method: "GET" })
    const alumno = await responsePerfil;
    const dataPerfil = alumno[0];
    setUsuarioId(dataPerfil.personas.usuarios[0].usuario_id);
    console.log(dataPerfil);
    setFormData({
      nombres: dataPerfil.personas.nombres,
      apellidos: dataPerfil.personas.apellidos,
      email: dataPerfil.email,
      telefono_contacto: dataPerfil.telefono_contacto1,
      fecha_nacimiento: reverseFormatDate(dataPerfil.personas.fecha_nacimiento),
      rut: dataPerfil.personas.numero_documento || "",
      password: "",
    });
  };
  const formatDate = (date: string) => {
    // Convertir DD/MM/YYYY a YYYY-MM-DD para la API
    const parts = date.split(/[\/\-]/);
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
        2,
        "0"
      )}`;
    }
    return date;
  };
const reverseFormatDate = (date: string) => {
  // Convertir YYYY-MM-DD a DD/MM/YYYY
  const parts = date.split(/[\/\-]/);
  if (parts.length === 3) {
    return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
  }
  return date;
};
  const handleSubmit = async () => {
    console.log("es valido", validateForm());

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = (await AsyncStorage.getItem("authToken")) || "demo-token";
      // Permitir navegación sin token para pruebas
      if (!token || token === "demo-token") {
        console.log("Usando modo demo para StudentProfile");
      }
      const alumnoId = await AsyncStorage.getItem("studentId"); // Permitir navegación sin token para pruebas
      const response = await fetchAuthApi(API_ENDPOINTS.PROFILE+"/" + usuarioId,
        {
          method: "PUT",
          body: JSON.stringify({
            nombres: formData.nombres.trim(),
            apellidos: formData.apellidos.trim(),
            fecha_nacimiento: formatDate(formData.fecha_nacimiento),
            numero_documento: formData.rut.trim(),
            nombre_social:
              formData.nombres.trim() + " " + formData.apellidos.trim(),
            email: formData.email.toLowerCase().trim(),
            url_foto_perfil: "  ",
            encripted_password: "1111111",//formData.password,
            telefono_contacto: formData.telefono_contacto.trim(),
            alumno_id: alumnoId,
            idioma_id: 1,
          }),
        }
      );
      navigation.navigate("Dashboard");
      const responseData = await response.json();
      // Guardar ID del alumno para uso posterior
      await AsyncStorage.setItem(
        "studentId",
        responseData.alumno_id.toString()
      );

      // Navegar a la siguiente pantalla (Consentimiento)
      navigation.navigate("Consent");
    } catch (error) {
      console.error("Error al registrar perfil del menor:", error);

    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatRutInput = (text: string) => {
    // Formatear RUT automáticamente
    const cleanText = text.replace(/[^\dkK]/g, "");
    if (cleanText.length <= 1) return cleanText;
    if (cleanText.length <= 4) return cleanText;
    if (cleanText.length <= 7) {
      return `${cleanText.slice(0, -3)}.${cleanText.slice(-3)}`;
    }
    if (cleanText.length <= 8) {
      return `${cleanText.slice(0, -4)}.${cleanText.slice(
        -4,
        -1
      )}-${cleanText.slice(-1)}`;
    }
    return `${cleanText.slice(0, -5)}.${cleanText.slice(
      -5,
      -2
    )}.${cleanText.slice(-2, -1)}-${cleanText.slice(-1)}`;
  };

  const formatDateInput = (text: string) => {
    // Formatear fecha automáticamente DD/MM/YYYY
    const cleanText = text.replace(/\D/g, "");
    if (cleanText.length <= 2) return cleanText;
    if (cleanText.length <= 4)
      return `${cleanText.slice(0, 2)}/${cleanText.slice(2)}`;
    return `${cleanText.slice(0, 2)}/${cleanText.slice(2, 4)}/${cleanText.slice(
      4,
      8
    )}`;
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
          <Text style={styles.title}>
            Completa el perfil de tu{"\n"}menor hijo
          </Text>
          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
          </View>
          {/* Formulario */}
          <View style={styles.form}>
            {/* Nombre completo */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nombres"
                placeholderTextColor="#9CA3AF"
                value={formData.nombres}
                onChangeText={(value) => handleInputChange("nombres", value)}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Apellidos"
                placeholderTextColor="#9CA3AF"
                value={formData.apellidos}
                onChangeText={(value) => handleInputChange("apellidos", value)}
                editable={!isLoading}
              />
            </View>

            {/* Fecha de nacimiento */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Fecha de nacimiento"
                placeholderTextColor="#9CA3AF"
                value={formData.fecha_nacimiento}
                onChangeText={(value) =>
                  handleInputChange("fecha_nacimiento", formatDateInput(value))
                }
                keyboardType="numeric"
                maxLength={10}
                editable={!isLoading}
              />
            </View>

            {/* RUT */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="card-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="RUT"
                placeholderTextColor="#9CA3AF"
                value={formData.rut}
                onChangeText={(value) =>
                  handleInputChange("rut", formatRutInput(value))
                }
                maxLength={12}
                editable={!isLoading}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {/* Contraseña */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry={true}
                editable={!isLoading}
              />
            </View>

            {/* Teléfono */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                placeholderTextColor="#9CA3AF"
                value={formData.telefono_contacto}
                onChangeText={(value) =>
                  handleInputChange("telefono_contacto", value)
                }
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
          </View>
          {/* Botón Continuar */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                isLoading && styles.continueButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#333" size="small" />
              ) : (
                <Text style={styles.continueButtonText}>Continuar</Text>
              )}
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
    backgroundColor: "#334155",
  },
  keyboardAvoid: {
    flex: 1,
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
    width: "60%", // Progreso aumentado para la segunda pantalla
  },
  form: {
    paddingHorizontal: 24,
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
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
    backgroundColor: "#FFE082",
    shadowOpacity: 0.1,
  },
  continueButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
