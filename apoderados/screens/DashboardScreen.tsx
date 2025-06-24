import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  agruparPorPregunta,
  siguientePregunta,
} from "../services/MotorPreguntasApoderado";
import { pantallaPregunta } from "../data/PantallaPreguntas";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { useAuth } from "context/AuthContext";
interface DashboardScreenProps {
  navigation: any;
}

interface Recordatorio {
  calendario_escolar_id: number;
  fecha: string;
  descripcion: string;
}

interface InformeMapeado {
  key: string;
  label: string;
  url_reporte: string;
  fecha: string;
}

const { width } = Dimensions.get("window");

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [informesDisponibles, setInformesDisponibles] = useState<
    InformeMapeado[]
  >([]);
  const [isLoadingRecordatorios, setIsLoadingRecordatorios] = useState(true);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [selectedTab, setSelectedTab] = useState("Inicio");
  const { user } = useAuth();

  const todosLosMeses = [
    { key: "01", label: "Ene" },
    { key: "02", label: "Feb" },
    { key: "03", label: "Mar" },
    { key: "04", label: "Abr" },
    { key: "05", label: "May" },
    { key: "06", label: "Jun" },
    { key: "07", label: "Jul" },
    { key: "08", label: "Ago" },
    { key: "09", label: "Sep" },
    { key: "10", label: "Oct" },
    { key: "11", label: "Nov" },
    { key: "12", label: "Dic" },
  ];

  useEffect(() => {
    comprobarPerfil();
    loadRecordatorios();
    loadInformes();
  }, []);
  const comprobarPerfil = async () => {
    console.log("entro a comprobar");

    if (user?.intentos === 0) {
      navigation.navigate("CompleteProfileApoderado");
    } else {
      const alumnoId = await AsyncStorage.getItem("studentId");
      console.log("alumnoId:", alumnoId);
      if (alumnoId === null) {
        navigation.navigate("ListadoEstudiantes");
      }
    }
  };
  const loadRecordatorios = async () => {
    setIsLoadingRecordatorios(true);
    try {
      let token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("Usando modo demo para Dashboard");
        token = "demo-token";
      }

      const colegioId = 1;
      const response = fetchAuthApi(
        API_ENDPOINTS.CALENDARIO + "?colegio_id=" + colegioId,
        {
          method: "GET",
        }
      );
      const data = await response;
      setRecordatorios(data);
    } catch (error) {
      console.error("Error al cargar recordatorios:", error);
      setRecordatorios([
        {
          calendario_escolar_id: 1,
          fecha: "2025-05-27",
          descripcion: "Reunión de padres en el liceo de Santiago.",
        },
        {
          calendario_escolar_id: 2,
          fecha: "2025-05-30",
          descripcion: "Examen mensual de Paolo, pendiente.",
        },
      ]);
    } finally {
      setIsLoadingRecordatorios(false);
    }
  };

  const loadInformes = async () => {
    setIsLoadingRecordatorios(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const studentId = await AsyncStorage.getItem("studentId");
      const response = fetchAuthApi(
        API_ENDPOINTS.INFORMES + "?alumno_id=" + studentId,
        {
          method: "GET",
        }
      );
      const data = await response;
      const informesConDatos = data
        .map((informe: any) => ({
          key: informe.fecha.slice(5, 7),
          label:
            todosLosMeses.find((m) => m.key === informe.fecha.slice(5, 7))
              ?.label || "",
          url_reporte: informe.url_reporte,
          fecha: informe.fecha,
        }))
        .filter((inf: InformeMapeado) => inf.url_reporte);

      setInformesDisponibles(informesConDatos);
    } catch (error) {
      console.error("Error:", error);
      setInformesDisponibles([
        {
          key: "05",
          label: "May",
          url_reporte: "https://ejemplo.com/informe-mayo.pdf",
          fecha: "2025-05-15",
        },
        {
          key: "06",
          label: "Jun",
          url_reporte: "https://ejemplo.com/informe-junio.pdf",
          fecha: "2025-06-20",
        },
      ]);
    } finally {
      setIsLoadingRecordatorios(false);
    }
  };

  const calculateDaysRemaining = (fecha: string): string => {
    const today = new Date();
    const targetDate = new Date(fecha);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "✅ Finalizada";
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Mañana";

    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffMonths > 11) {
      return `Faltan ${diffYears} año${diffYears > 1 ? "s" : ""}`;
    }

    if (diffDays > 29) {
      return `Faltan ${diffMonths} mes${diffMonths > 1 ? "es" : ""}`;
    }

    return `Faltan ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  };

  const handleGenerateKey = async () => {
    setIsGeneratingKey(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const studentId = await AsyncStorage.getItem("studentId");
      if (!studentId) {
        console.log("Error: ID del estudiante no encontrado");

        return;
      }
      const responseAlumno = await fetchAuthApi(
        API_ENDPOINTS.ALUMNO_DETALLE + "/" + studentId,
        { method: "GET" }
      );

      const dataAlumno = await responseAlumno;
      console.log(dataAlumno.alumno.persona_id);
      const responseUsuario = await fetchAuthApi(
        API_ENDPOINTS.USUARIO + "?persona_id=" + dataAlumno.alumno.persona_id,
        { method: "GET" }
      );

      const dataUsuario = await responseUsuario;
      const key = Math.floor(10000 + Math.random() * 90000).toString();
      setGeneratedKey(key);

      await fetchAuthApi(
        API_ENDPOINTS.USUARIO_CLAVE + "/" + dataUsuario[0].usuario_id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "AlmaIA-Parent-App/1.0",
          },
          body: JSON.stringify({ clave: key }),
        }
      );
      setShowKeyModal(true);
      console.log("¡Clave dinámica generada exitosamente!");
    } catch (error) {
      console.error("Error al generar clave dinámica:", error);
      console.error("Error de conexión. Intenta más tarde.");
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleResponderPreguntas = async () => {
    const token = (await AsyncStorage.getItem("authToken")) || "demo-token";

    const responsePreguntas = await fetchAuthApi(
      API_ENDPOINTS.APODERADO_RESPUESTAS +
        "?apoderado_id=" +
        user?.apoderado_id,
      { method: "GET" }
    );
    const dataPreguntas = await responsePreguntas;
    console.log(dataPreguntas);
    const preguntasAlumno = agruparPorPregunta(dataPreguntas);
    console.log(preguntasAlumno);
    //siguientePregunta(navigation,pantallaPregunta[preguntasAlumno[0]?.template_code],preguntasAlumno,0)
    siguientePregunta(
      navigation,
      pantallaPregunta["ConoceHijo"],
      preguntasAlumno,
      0
    );
    //navigation.navigate("PersonalizedQuestion");
  };

  const formatKeyDigits = (key: string) => {
    return key.split("").map((digit, index) => (
      <Text key={index} style={styles.modalKeyDigit}>
        {digit}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.gradientBackground} />
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text style={styles.todayTitle}>!Hola!</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={() => navigation.navigate("SOS")}
          >
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            <Text style={styles.speechBold}>¿Conoces</Text> bien{"\n"}a tu{" "}
            <Text style={styles.speechBold}>hijo?</Text>
          </Text>
          <View style={styles.speechTail} />
        </View>

        <View style={styles.almieContainer}>
          <Image
            source={require("../../assets/almis/AlmiePreguntas.png")}
            style={styles.image}
          />
        </View>

        <TouchableOpacity
          style={styles.answerButton}
          onPress={handleResponderPreguntas}
        >
          <Text style={styles.answerButtonText}>Responder preguntas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recordatorios y fechas</Text>

          {isLoadingRecordatorios ? (
            <ActivityIndicator
              color="#334155"
              size="small"
              style={styles.loader}
            />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recordatoriosScroll}
            >
              {recordatorios.map((recordatorio, index) => (
                <View
                  key={`${recordatorio.calendario_escolar_id}-${index}`}
                  style={styles.recordatorioCard}
                >
                  <Text style={styles.recordatorioTitle}>
                    {recordatorio.descripcion.split(" ")[0]}
                  </Text>
                  <Text style={styles.recordatorioDescription}>
                    {recordatorio.descripcion}
                  </Text>
                  <View style={styles.recordatorioFooter}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.recordatorioTime}>
                      {calculateDaysRemaining(recordatorio.fecha)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informes psicoemocionales</Text>
            <TouchableOpacity style={styles.yearSelector}>
              <Text style={styles.yearSelectorText}>{currentYear}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {isLoadingRecordatorios ? (
            <ActivityIndicator
              color="#334155"
              size="small"
              style={styles.loader}
            />
          ) : (
            <View style={styles.monthsGrid}>
              {informesDisponibles.map((informe) => (
                <TouchableOpacity
                  key={informe.key}
                  style={styles.monthButton}
                  onPress={() => Linking.openURL(informe.url_reporte)}
                >
                  <Ionicons name="download-outline" size={20} color="#333" />
                  <Text style={styles.monthButtonText}>{informe.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Generar clave dinámica para mi hijo
          </Text>
          <TouchableOpacity
            style={[
              styles.generateKeyButton,
              isGeneratingKey && styles.generateKeyButtonDisabled,
            ]}
            onPress={handleGenerateKey}
            disabled={isGeneratingKey}
          >
            {isGeneratingKey ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.generateKeyButtonText}>Generar clave</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[
            styles.navItem,
            selectedTab === "Inicio" && styles.navItemActive,
          ]}
          onPress={() => setSelectedTab("Inicio")}
        >
          <Ionicons
            name="home"
            size={24}
            color={selectedTab === "Inicio" ? "#334155" : "#666"}
          />
          <Text
            style={[
              styles.navText,
              selectedTab === "Inicio" && styles.navTextActive,
            ]}
          >
            Inicio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            selectedTab === "Convenios" && styles.navItemActive,
          ]}
          onPress={() =>{ setSelectedTab("Convenios")
                        navigation.navigate("Convenio");

          }}
        >
          <Ionicons
            name="cube-outline"
            size={24}
            color={selectedTab === "Convenios" ? "#334155" : "#666"}
          />
          <Text
            style={[
              styles.navText,
              selectedTab === "Convenios" && styles.navTextActive,
            ]}
          >
            Convenios
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, selectedTab === "Yo" && styles.navItemActive]}
          onPress={() => {
            setSelectedTab("Yo");
            navigation.navigate("UserProfile");
          }}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={selectedTab === "Yo" ? "#334155" : "#666"}
          />
          <Text
            style={[
              styles.navText,
              selectedTab === "Yo" && styles.navTextActive,
            ]}
          >
            Yo
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showKeyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowKeyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowKeyModal(false)}
              >
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Clave dinámica generada</Text>

            <View style={styles.modalKeyContainer}>
              {formatKeyDigits(generatedKey)}
            </View>

            <Text style={styles.modalInstructions}>
              Ingresa este código en la app de AlmaIA Niños para que tu hijo
              pueda acceder a su cuenta.
            </Text>

            <Text style={styles.modalExpiration}>
              Este código expira en 15 minutos
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowKeyModal(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 280,
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
    backgroundColor: "#334155",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerTop: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 3,
    minHeight: 40, // Añadir altura mínima
  },
  todayTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    flexShrink: 1, // Permite que el texto se contraiga
    numberOfLines: 1, // Limita a una línea
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
  speechBubble: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  almie: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    marginBottom: 6,
  },
  eye: {
    width: 8,
    height: 12,
    backgroundColor: "#000",
    borderRadius: 4,
    marginHorizontal: 3,
  },
  smile: {
    width: 16,
    height: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    borderRadius: 8,
  },
  leftArm: {
    position: "absolute",
    left: -12,
    top: 15,
    width: 2,
    height: 20,
    backgroundColor: "#000",
    borderRadius: 1,
    transform: [{ rotate: "-30deg" }],
  },
  rightArm: {
    position: "absolute",
    right: -12,
    top: 15,
    width: 2,
    height: 20,
    backgroundColor: "#000",
    borderRadius: 1,
    transform: [{ rotate: "30deg" }],
  },
  rightHand: {
    position: "absolute",
    right: -22,
    top: 12,
  },
  waveEmoji: {
    fontSize: 14,
  },
  feet: {
    flexDirection: "row",
    position: "absolute",
    bottom: -12,
    justifyContent: "center",
  },
  foot: {
    width: 8,
    height: 6,
    backgroundColor: "#000",
    borderRadius: 4,
    marginHorizontal: 1,
  },
  answerButton: {
    backgroundColor: "#FFC107",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    zIndex: 2,
  },
  answerButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  yearSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  yearSelectorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 4,
  },
  loader: {
    marginVertical: 20,
  },
  recordatoriosScroll: {
    marginBottom: 8,
  },
  recordatorioCard: {
    backgroundColor: "#64748B",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    minHeight: 120,
  },
  recordatorioTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  recordatorioDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
    marginBottom: 12,
    flex: 1,
  },
  recordatorioFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordatorioTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  monthButton: {
    backgroundColor: "#FFC107",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    margin: "1.5%",
    aspectRatio: 1,
  },
  monthButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  generateKeyButton: {
    backgroundColor: "#334155",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  generateKeyButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  generateKeyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNavigation: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  modalKeyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalKeyDigit: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#334155",
    marginHorizontal: 6,
  },
  modalInstructions: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  modalExpiration: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#FFC107",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  modalButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  userName: {  
  fontSize: 24,  
  fontWeight: "bold",  
  color: "#fff",  
  flexShrink: 1,  
},
});
