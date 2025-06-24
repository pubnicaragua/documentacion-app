"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"

const CompleteProfileScreen = () => {
  const navigation = useNavigation()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [socialName, setSocialName] = useState("")

  // Función para seleccionar una imagen de la galería
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        alert("Se requiere permiso para acceder a la galería")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri)
      }
    } catch (error) {
      console.log("Error al seleccionar imagen:", error)
    }
  }

  // Función para continuar
  const handleContinue = () => {
    console.log("Imagen de perfil:", profileImage)
    console.log("Nombre social:", socialName)
    // Navegar a la pantalla principal
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    })
  }

  // Función para volver a la pantalla anterior
  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.iconCircle}>
                <Ionicons name="image-outline" size={40} color="white" />
              </View>
            )}
          </View>

          <Text style={styles.title}>Completa tu perfil</Text>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.uploadButtonText}>Sube una imagen de perfil</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Ionicons name="pencil" size={24} color="white" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre social"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={socialName}
              onChangeText={setSocialName}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, !socialName && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!socialName}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9D4FB",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
    textAlign: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: "100%",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: "#2196F3",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default CompleteProfileScreen
