import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import TaskItem from "./TaskItem";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { useToast } from "context/ToastContext";
import AddTaskModal from "../modals/AddTaskModal";
import { useProfile } from "context/ProfileContext";

interface Task {
  id: number;
  subject: string;
  description: string;
  dueDate: string;
  color: string;
}

interface TaskListProps {
  month: string;
  tasks: Task[];
}

const TaskList = ({ month, tasks = [] }: TaskListProps) => {
  const [taskItems, setTaskItems] = useState<Task[]>(
    Array.isArray(tasks) ? tasks : []
  );
  const { showToast } = useToast();
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleDelete = (id: number) => {
    Alert.alert("Eliminar tarea", "¿Estás seguro de eliminar esta tarea?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setTaskItems((prev) => prev.filter((task) => task.id !== id));
          eliminarBD(id);
          showToast("Se ha eliminado tarea correctamente.", "info");
        },
      },
    ]);
  };
  const eliminarBD = async (tarea_id: number) => {
    await fetchAuthApi(API_ENDPOINTS.TAREAS + "/" + tarea_id, {
      method: "DELETE",
    });
  };
  const handleEdit = (id: number) => {
    const task = taskItems.find((t) => t.id === id);
    if (task) {
      setTaskToEdit(task);
      setAddTaskModalVisible(true);
    }
  };
function parseFechaTexto(texto: string): string {
  const meses: Record<string, number> = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  }

  const regex = /(\d{1,2}) de (\w+) a las (\d{1,2}):(\d{2}) (AM|PM)/i
  const match = texto.match(regex)

  if (!match) throw new Error("Formato de texto inválido")

  const [, diaStr, mesStr, horaStr, minutoStr, meridiano] = match

  const dia = parseInt(diaStr)
  const mes = meses[mesStr.toLowerCase()]
  if (!mes) throw new Error("Mes no reconocido")

  let hora = parseInt(horaStr)
  const minutos = parseInt(minutoStr)

  if (meridiano.toUpperCase() === "PM" && hora !== 12) {
    hora += 12
  } else if (meridiano.toUpperCase() === "AM" && hora === 12) {
    hora = 0
  }

  const ahora = new Date()
  const anio = ahora.getFullYear()

  const fecha = new Date(anio, mes - 1, dia, hora, minutos)

  const pad = (n: number) => n.toString().padStart(2, "0")

  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`
}
  if (taskItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.month}>{month}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay tareas para este mes</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.month}>{month}</Text>
      <FlatList
        data={taskItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            subject={item.subject}
            description={item.description}
            dueDate={item.dueDate}
            color={item.color}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => handleEdit(item.id)}
          />
        )}
        scrollEnabled={false}
      />
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        onAddTask={(task) => console.log(task)}
        taskToEdit={
          taskToEdit
            ? {
                tarea_id: taskToEdit.id,
                subject: taskToEdit.subject,
                description: taskToEdit.description,
                dueDate: parseFechaTexto(taskToEdit.dueDate),
                dueTime:
                  taskToEdit.dueDate.split("T")[1]?.substring(0, 5) ?? "00:00",
                color: taskToEdit.color,
                type: "Tarea", // O el valor correspondiente si tienes esa propiedad
              }
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  month: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  emptyContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});

export default TaskList;
function agregarTarea(arg0: boolean) {
  throw new Error("Function not implemented.");
}

