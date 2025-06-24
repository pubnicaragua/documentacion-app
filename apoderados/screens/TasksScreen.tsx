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
import Header from "src/components/home/Header";
import MascotMessage from "src/components/tasks/MascotMessage";
import TaskTabs from "src/components/tasks/TaskTabs";
import TaskList from "src/components/tasks/TaskList";
import SOSModal from "src/components/modals/SOSModal";
import AddTaskModal from "src/components/modals/AddTaskModal";
import { Ionicons } from "@expo/vector-icons";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { useAuth } from "context/AuthContext";;
import { useProfile } from "context/ProfileContext";
import { mapearTareasPorMes } from "service/TareasService";

const TasksScreen = () => {
  const [activeTab, setActiveTab] = useState("Tareas");
  const [sosModalVisible, setSOSModalVisible] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const { user } = useAuth();
  const { tareaAgregada } = useProfile();

  const [allTasks, setAllTasks] = useState([]); // Todas las tareas sin filtrar

  // Añadir un efecto para registrar cuando se monta el componente
  useEffect(() => {
    obtener_tareas();
    return () => {
    };
  }, [tareaAgregada]);

  async function obtener_tareas() {
    try {
      const tareas = await fetchAuthApi(
        API_ENDPOINTS.TAREAS + "?alumno_id=" + user?.alumno_id,
        {
          method: "GET",
        }
      );
      const tareas_mes = mapearTareasPorMes(tareas);
      setAllTasks(tareas_mes); // Guardar todas las tareas
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      throw error;
    }
  }

  // Función para filtrar tareas según la pestaña activa
  const getFilteredTasks = () => {
  if (!allTasks || allTasks.length === 0) return [];

  const tipoPorTab = {
    Tareas: "tarea",
    Examenes: "examen",
    Proyectos: "proyecto",
  };
  const activeTabNormalizado= activeTab.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  console.log('tab',activeTabNormalizado);
  const tipoFiltrado = tipoPorTab[activeTabNormalizado];

  return allTasks
    .map((taskGroup) => {
      const filteredItems = taskGroup.items.filter((task) => {
        if (!tipoFiltrado) return true; // Si el tab no está en el mapa, no filtrar nada
        // Aseguramos que el tipo de tarea sea una cadena en minúsculas
        return (
          typeof task.tipo_tarea === "string" &&
          task.tipo_tarea.toLowerCase() === tipoFiltrado
        );
      });

      return {
        ...taskGroup,
        items: filteredItems,
      };
    })
    .filter((taskGroup) => taskGroup.items.length > 0); // Solo grupos con elementos
};


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

  const handleAccessibilityPress = () => {
    setAddTaskModalVisible(true);
  };

 const handleAddTask = async () => {
  console.log('add taREAS');
  
  await obtener_tareas(); // refrescar desde la API
};

  // Obtener las tareas filtradas
  const filteredTasks = getFilteredTasks();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header />
        <MascotMessage
          message="¡Escoge para agregar en tu rutina de tareas!"
          points={500}
        />
        <TaskTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {filteredTasks && filteredTasks.length > 0 ? (
          filteredTasks.map((taskGroup) => (
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
