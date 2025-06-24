import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAuthApi, API_ENDPOINTS } from "config/api";
import { useAuth } from "context/AuthContext";

interface UserProfileScreenProps {
  navigation: any;
}
interface Entrada {
  usuario: {
    usuario_id: number;
    nombre_social: string;
    email: string;
    telefono_contacto: string;
    url_foto_perfil: string;
    persona_id: number;
    rol_id: number;
    idioma_id: number;
  };
  persona: {
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
  };
}

interface Salida {
  usuario_id: number;
  nombre_social: string;
  email: string;
  telefono_contacto: string;
  url_foto_perfil: string;
  persona: {
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    nacionalidad: string;
  };
  colegio: {
    nombre: string;
  };
}

interface UserData {
  usuario_id: number;
  nombre_social: string;
  email: string;
  telefono_contacto: string;
  url_foto_perfil?: string;
  persona: {
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    nacionalidad: string;
  };
  colegio: {
    nombre: string;
  };
}

export default function UserProfileScreen({
  navigation,
}: UserProfileScreenProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    loadUserData();
  }, []);
  const mapearUsuario = (data: Entrada): Salida => {
    return {
      usuario_id: data.usuario.usuario_id,
      nombre_social: data.usuario.nombre_social,
      email: data.usuario.email,
      telefono_contacto: data.usuario.telefono_contacto,
      url_foto_perfil: data.usuario.url_foto_perfil,
      persona: {
        nombre: data.persona.nombres,
        apellido: data.persona.apellidos,
        fecha_nacimiento: data.persona.fecha_nacimiento,
        nacionalidad: "Chile", // Valor fijo o puedes hacerlo dinámico
      },
      colegio: {
        nombre: "Santiago Apostol", // Valor fijo o configurable
      },
    };
  };
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken"); // Permitir navegación sin token para pruebas
      if (!token) {
        console.log("Usando modo demo para UserProfile");
      }
      const response = fetchAuthApi(API_ENDPOINTS.PROFILE_GENERAL, {
        method: "GET",
      });

      const data = await response;

      setUserData(mapearUsuario(data));
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // TODO: Navegar a pantalla de edición del perfil del apoderado
     navigation.navigate('CompleteProfileApoderado');
  
  };

  const handleEditStudentProfile = () => {
    // TODO: Navegar a pantalla de edición del perfil del menor
    navigation.navigate('StudentProfile');
   
  };

  const handleLogout = () => {
    logout()
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("es-ES", options);
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#334155" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Error al cargar el perfil</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header con gradiente */}
      <View style={styles.header}>
        <View style={styles.gradientBackground} />

        {/* Foto de perfil y nombre */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  userData.url_foto_perfil ||
                  "https://api.a0.dev/assets/image?text=profile&aspect=1:1",
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>{userData.nombre_social}</Text>{" "}
          {/* Botón SOS */}
          <TouchableOpacity
            style={styles.sosButton}
            onPress={() => navigation.navigate("SOS")}
          >
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección Datos personales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos personales</Text>

          <View style={styles.dataContainer}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nombre:</Text>
              <Text style={styles.dataValue}>
                {userData.persona.nombre} {userData.persona.apellido}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nombre social:</Text>
              <Text style={styles.dataValue}>{userData.nombre_social}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Fecha de nacimiento:</Text>
              <Text style={styles.dataValue}>
                {formatDate(userData.persona.fecha_nacimiento)}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nacionalidad:</Text>
              <Text style={styles.dataValue}>
                {userData.persona.nacionalidad}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Correo:</Text>
              <Text style={styles.dataValue}>{userData.email}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Colegio:</Text>
              <Text style={styles.dataValue}>{userData?.colegio?.nombre}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Número de contacto:</Text>
              <Text style={styles.dataValue}>
                {userData?.telefono_contacto}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>ID:</Text>
              <Text style={styles.dataValue}>{userData?.usuario_id}</Text>
            </View>
          </View>
        </View>

        {/* Opciones de acción */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Editar mi perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleEditStudentProfile}
          >
            <Ionicons name="create-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Editar el perfil del menor</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Cerrar Sesión</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navegación inferior */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="home-outline" size={24} color="#666" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}   onPress={() => navigation.navigate("Convenio")}>
          <Ionicons name="cube-outline" size={24} color="#666" />
          <Text style={styles.navText}>Convenios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="person" size={24} color="#334155" />
          <Text style={[styles.navText, styles.navTextActive]}>Yo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    height: 140,
    position: "relative",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#334155",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  sosButton: {
    backgroundColor: "#EF4444",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sosButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  dataContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dataRow: {
    marginBottom: 16,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 100, // Espacio para la navegación inferior
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    fontWeight: "500",
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    opacity: 1,
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  navTextActive: {
    color: "#334155",
    fontWeight: "600",
  },
});
