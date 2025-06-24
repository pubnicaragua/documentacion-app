import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { useAuth } from "context/AuthContext";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
interface ListadoAlumnosScreeenProps {
  navigation: any;
}

const ListadoAlumnosScreeen = ({ navigation }: ListadoAlumnosScreeenProps) => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  // Función para obtener alumnos de la API
  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Reemplaza esta URL con tu endpoint real
      const token = await AsyncStorage.getItem("authToken"); // Permitir navegación sin token para pruebas
      const response = await fetchAuthApi(
        API_ENDPOINTS.ALUMNOS_APODERADOS +"?apoderado_id=" +user?.apoderado_id,
        {
          method: "GET",
        }
      );
      const data = await response;
      // Mapea los datos de la API al formato que necesita tu componente
      const alumnosMapeados = data.map((estudiante) => {
        const id = estudiante?.alumnos?.alumno_id;
        const nombres =
          estudiante?.alumnos?.personas?.nombres ??
          estudiante?.first_name ??
          "";
        const apellidos =
          estudiante?.alumnos?.personas?.apellidos ??
          estudiante?.last_name ??
          "";
        const foto =
          estudiante?.alumnos?.url_foto_perfil ||
          estudiante?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            nombres + " " + apellidos
          )}&background=334155&color=fff`;
        const consentimiento = estudiante?.alumnos?.consentimiento ?? false;
        return {
          id: id ?? 0,
          nombre: nombres,
          apellido: apellidos,
          foto,
          consentimiento,
        };
      });
      console.log(alumnosMapeados);

      setAlumnos(alumnosMapeados);
    } catch (err) {
      console.error("Error al obtener alumnos:", err);
      setError(err.message);

      // Datos de fallback en caso de error
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar alumnos al montar el componente
  useEffect(() => {
    fetchAlumnos();
  }, []);

  // Función para recargar datos
  const handleRefresh = () => {
    fetchAlumnos();
  };
  const handleSeleccionarAlumno = async (
    id: number,
    consentimiento: boolean
  ) => {
    try {
      await AsyncStorage.setItem("studentId", id.toString());
      Alert.alert("Alumno seleccionado", `ID guardado: ${id}`);
      if (!consentimiento) {
        navigation.navigate("Consent");
      } else {
        navigation.navigate("Dashboard");
      }
    } catch (e) {
      console.error("Error al guardar alumno seleccionado:", e);
    }
  };
  // Mostrar loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#334155" />
        <View style={styles.header}>
          <Text style={styles.titulo}>Lista de Alumnoos</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#334155" />
          <Text style={styles.loadingText}>Cargando Alumnos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar error
  if (error && alumnos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#334155" />
        <View style={styles.header}>
          <Text style={styles.titulo}>Lista de Alumnos</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar alumnos</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#334155" />

      <View style={styles.header}>
        <Text style={styles.titulo}>Lista de Alumnos</Text>
        {error && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={alumnos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tarjeta}
            onPress={() =>
              handleSeleccionarAlumno(item.id, item.consentimiento)
            }
          >
            <Image
              source={{ uri: item.foto }}
              style={styles.foto}
              onError={() => {
                // Fallback si la imagen no carga
                console.log("Error cargando imagen para:", item.nombre);
              }}
            />
            <View style={styles.datos}>
              <Text style={styles.nombre}>
                {item.nombre} {item.apellido}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        refreshing={loading}
        onRefresh={handleRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay alumnos disponibles</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Recargar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#334155",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  lista: {
    padding: 20,
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  foto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    backgroundColor: "#f0f0f0", // Fallback color
  },
  datos: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
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
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 8,
    textAlign: "center",
  },
  errorDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#334155",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ListadoAlumnosScreeen;
