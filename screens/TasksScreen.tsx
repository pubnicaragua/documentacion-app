"use client";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../src/components/home/Header";
import MascotMessage from "../src/components/tasks/MascotMessage";
import TaskTabs from "../src/components/tasks/TaskTabs";
import TaskList from "../src/components/tasks/TaskList";
import SOSModal from "../src/components/modals/SOSModal";
import AddTaskModal from "../src/components/modals/AddTaskModal";
import { Ionicons } from "@expo/vector-icons";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { mapearTareasPorMes } from "service/TareasService";
import { useAuth } from "context/AuthContext";
import { useProfile } from "context/ProfileContext";

const TasksScreen = () => {
  const [activeTab, setActiveTab] = useState("Tareas");
  const [sosModalVisible, setSOSModalVisible] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const { user } = useAuth();
  const { tareaAgregada } = useProfile();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Definimos el tipo específico para cada pestaña
        const tipoPorTab = {
          Tareas: "Tarea", // Ahora "Tareas" filtra específicamente por tipo "Tarea"
          Exámenes: "Examen",
          Proyectos: "Proyecto",
        };

        const tipoFiltro = tipoPorTab[activeTab];
        let url = `${API_ENDPOINTS.TAREAS}?alumno_id=${user?.alumno_id}`;

        // Siempre aplicamos filtro, incluso para la pestaña "Tareas"
        if (tipoFiltro) {
          url += `&tipo_tarea=${encodeURIComponent(tipoFiltro)}`;
        }

        const tareas = await fetchAuthApi(url, { method: "GET" });
        const tareasActivas = tareas.filter((t) => t.activo);
        const tareas_mes = mapearTareasPorMes(tareasActivas);
        setTasks(tareas_mes);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeTab, tareaAgregada, user?.alumno_id]);

  const handleSOSPress = () => {
    setSOSModalVisible(true);
  };

  const handleCloseSOSModal = () => {
    setSOSModalVisible(false);
  };

  const handleRequestHelp = () => {
    console.log("Solicitar ayuda");
    setSOSModalVisible(false);
  };

  const handleReport = () => {
    console.log("Realizar denuncia");
    setSOSModalVisible(false);
  };

  const handleAddTask = async () => {
    // Vuelve a cargar las tareas con el filtro actual después de agregar una nueva
    const tipoPorTab = {
      Tareas: "Tarea",
      Exámenes: "Examen",
      Proyectos: "Proyecto",
    };
    const tipoFiltro = tipoPorTab[activeTab];
    let url = `${API_ENDPOINTS.TAREAS}?alumno_id=${user?.alumno_id}`;
    
    if (tipoFiltro) {
      url += `&tipo_tarea=${encodeURIComponent(tipoFiltro)}`;
    }

    const tareas = await fetchAuthApi(url, { method: "GET" });
    const tareasActivas = tareas.filter((t) => t.activo);
    const tareas_mes = mapearTareasPorMes(tareasActivas);
    setTasks(tareas_mes);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header />
        <MascotMessage
          message="¡Escoge para agregar en tu rutina de tareas!"
          points={500}
        />
        <TaskTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Cargando...</Text>
          </View>
        ) : tasks && tasks.length > 0 ? (
          tasks.map((taskGroup) => (
            <TaskList
              key={taskGroup.id}
              month={taskGroup.month}
              tasks={taskGroup.items || []}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay {activeTab.toLowerCase()} disponibles
            </Text>
          </View>
        )}
      </ScrollView>

      <SOSModal
        visible={sosModalVisible}
        onClose={handleCloseSOSModal}
        onRequestHelp={handleRequestHelp}
        onReport={handleReport}
      />

      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        onAddTask={handleAddTask}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddTaskModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9D4FB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 15,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});

export default TasksScreen;