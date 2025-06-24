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
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { API_ENDPOINTS, fetchApi, fetchAuthApi } from "config/api";

interface CompleteProfileApoderadoScreenProps {
  navigation: any;
}

export default function CompleteProfileApoderadoScreen({
  navigation,
}: CompleteProfileApoderadoScreenProps) {
  const [usuarioId, setUsuarioId] = useState(0);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    nombre_social: "",
    email: "",
    telefono_contacto: "",
    fecha_nacimiento: "",
    rut: "",
    url_foto_perfil: "",
    rol_id: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
      "nombre_social",
      "email",
      "telefono_contacto",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        //toast.error(`Por favor completa el campo ${field.replace("_", " ")}`);
        return false;
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      //toast.error("Por favor ingresa un correo electrónico válido");
      return false;
    }

    // Validar teléfono (formato chileno básico)
    const phoneRegex = /^(\+56)?[0-9]{8,9}$/;
    if (!phoneRegex.test(formData.telefono_contacto.replace(/\s/g, ""))) {
      //toast.error("Por favor ingresa un número de teléfono válido");
      return false;
    }

    return true;
  };

  const selectImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permisos necesarios",
          "Se necesitan permisos para acceder a la galería"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        // En una implementación real, aquí subirías la imagen a un servidor
        // Por ahora, usaremos una URL de ejemplo
        setFormData((prev) => ({
          ...prev,
          url_foto_perfil:
            "https://api.a0.dev/assets/image?text=profile%20photo&aspect=1:1",
        }));
      }
    } catch (error) {
      //toast.error("Error al seleccionar imagen");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetchAuthApi(
        API_ENDPOINTS.USUARIO + "/" + usuarioId,
        {
          method: "PUT",
          body: JSON.stringify({
            nombres: formData.nombres.trim(),
            apellidos: formData.apellidos.trim(),
            nombre_social: formData.nombre_social.trim(),
            email: formData.email.toLowerCase().trim(),
            telefono_contacto: formData.telefono_contacto.trim(),
            url_foto_perfil:
              formData.url_foto_perfil ||
              "https://api.a0.dev/assets/image?text=default%20profile&aspect=1:1",
            idioma_id: 1,
            rol_id: formData.rol_id,
          }),
        }
      );
      const responseData = await response;
      // Guardar ID de usuario para uso posterior
      await AsyncStorage.setItem("userId", responseData.usuario_id.toString());
      //toast.success("¡Perfil completado exitosamente!");
      navigation.navigate("ListadoEstudiantes");
    } catch (error) {
      console.error("Error al completar perfil:", error);
      //toast.error("Error de conexión. Verifica tu internet e intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };
  // Cargar alumnos al montar el componente
  useEffect(() => {
    obtenerPerfil();
  }, []);
  const obtenerPerfil = async () => {
    const responsePerfil = await fetchAuthApi(API_ENDPOINTS.PROFILE_GENERAL, {
      method: "GET",
    });
    const dataPerfil = await responsePerfil;
    setUsuarioId(dataPerfil.usuario.usuario_id);
    console.log(dataPerfil);
    setFormData({
      nombres: dataPerfil.persona.nombres,
      apellidos: dataPerfil.persona.apellidos,
      nombre_social: dataPerfil.usuario.nombre_social,
      email: dataPerfil.usuario.email,
      telefono_contacto: dataPerfil.usuario.telefono_contacto,
      fecha_nacimiento: dataPerfil.persona.fecha_nacimiento,
      rut: dataPerfil.persona.numero_documento || "",
      url_foto_perfil: dataPerfil.usuario.url_foto_perfil,
      rol_id: dataPerfil.usuario.rol_id,
    });
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

            <TouchableOpacity
              style={styles.profileImageButton}
              onPress={selectImage}
            >
              <Ionicons name="image-outline" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerSpacer} />
          </View>
          {/* Título */}
          <Text style={styles.title}>Completa tu perfil</Text>
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
                placeholder="Nombre completo"
                placeholderTextColor="#9CA3AF"
                value={formData.nombres}
                onChangeText={(value) => handleInputChange("nombres", value)}
                editable={!isLoading}
              />
            </View>

            {/* Apellidos */}
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

            {/* Nombre social */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nombre social"
                placeholderTextColor="#9CA3AF"
                value={formData.nombre_social}
                onChangeText={(value) =>
                  handleInputChange("nombre_social", value)
                }
                editable={!isLoading}
              />
            </View>

            {/* Subir imagen de perfil */}
            <TouchableOpacity
              style={styles.imageUploadContainer}
              onPress={selectImage}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <Text style={styles.imageUploadText}>
                {profileImage
                  ? "Imagen seleccionada"
                  : "Sube una imagen de perfil"}
              </Text>
              {profileImage && (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.previewImage}
                />
              )}
            </TouchableOpacity>

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
                  handleInputChange("fecha_nacimiento", value)
                }
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
                onChangeText={(value) => handleInputChange("rut", value)}
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
    width: 40, // Para balancear el header
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
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#FFC107",
    borderRadius: 4,
    width: "30%", // Representa el progreso actual
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
  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    minHeight: 56,
    paddingVertical: 12,
  },
  imageUploadText: {
    flex: 1,
    color: "#9CA3AF",
    fontSize: 16,
  },
  previewImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
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
