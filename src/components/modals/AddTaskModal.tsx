"use client";
import { SetStateAction, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  View,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { useAuth } from "context/AuthContext";
import { useProfile } from "context/ProfileContext";
import { Materia } from "data/Materia";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: {
    subject: string;
    description: string;
    dueDate: string;
    dueTime: string;
    color: string;
    type: string;
  }) => void;
  taskToEdit?: {
    tarea_id:number,
    subject: string;
    description: string;
    dueDate: string; // formato YYYY-MM-DD
    dueTime: string; // formato HH:mm
    color: string;
    type: string;
  };
}

const AddTaskModal = ({
  visible,
  onClose,
  onAddTask,
  taskToEdit,
}: AddTaskModalProps) => {
  const [subject, setSubject] = useState(0);
  const [subjects, setSubjects] = useState<Materia[]>([]);
  const [selectedColor, setSelectedColor] = useState("#2196F3");
  const [taskType, setTaskType] = useState("Tarea");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tarea_id, setTareaId] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { user } = useAuth();
  const {tareaAgregada, agregarTarea } = useProfile();

useEffect(() => {  
  if (visible) {  
    fetchSubjects();  
  }  
}, [visible]);
useEffect(() => {  
  if (visible && taskToEdit && subjects.length > 0) {  
    const subject = subjects.find((s) => s.nombre === taskToEdit.subject);  
    setTareaId(taskToEdit.tarea_id);  
    setSubject(subject?.materia_id || 0);  
    setDescription(taskToEdit.description);  
    setSelectedColor(taskToEdit.color);  
    setTaskType(taskToEdit.type);  
    const parsedDate = dayjs(taskToEdit.dueDate).toDate();  
    setDate(parsedDate);  
    setTime(parsedDate);  
  }  
}, [visible, taskToEdit, subjects]);

  async function fetchSubjects() {
    try {
      const data = await fetchAuthApi(API_ENDPOINTS.MATERIAS, {
        method: "GET",
      });
      setSubjects(data);
      if (visible && taskToEdit) {
        const subject = data?.find((s: { nombre: string; }) => s.nombre === taskToEdit.subject);
        setTareaId(taskToEdit.tarea_id);
        setSubject(subject?.materia_id||0);
        setDescription(taskToEdit.description);
        setSelectedColor(taskToEdit.color);
        setTaskType(taskToEdit.type);
        const parsedDate = dayjs(taskToEdit.dueDate).toDate();
        setDate(parsedDate);
        setTime(parsedDate);
      }
    } catch (err) {
      console.error("Error al obtener materias:", err);
    }
  }

  const formattedDate = dayjs(date).format("YYYY-MM-DD");
  const formattedTime = dayjs(time).format("HH:mm");

  const handleFinish = async () => {
    if (subject && description.trim()) {
      const fechaProgramacion = dayjs(date)
        .set("hour", time.getHours())
        .set("minute", time.getMinutes())
        .format("YYYY-MM-DD HH:mm");

      onAddTask({
        subject: subject.toString(),
        description,
        dueDate: formattedDate,
        dueTime: formattedTime,
        color: selectedColor,
        type: taskType,
      });
if(taskToEdit){
 await fetchAuthApi(API_ENDPOINTS.TAREAS+'/'+tarea_id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumno_id: user?.alumno_id,
          materia_id: subject,
          tipo_tarea: taskType,
          descripcion_tarea: description,
          fecha_programacion: fechaProgramacion,
          color: selectedColor,
          estado_tarea: "pendiente",
        }),
      });
            agregarTarea(!tareaAgregada);
}else{
   await fetchAuthApi(API_ENDPOINTS.TAREAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumno_id: user?.alumno_id,
          materia_id: subject,
          tipo_tarea: taskType,
          descripcion_tarea: description,
          fecha_programacion: fechaProgramacion,
          color: selectedColor,
          estado_tarea: "pendiente",
        })
      });
                  agregarTarea(!tareaAgregada);

}
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setSubject(0);
    setSelectedColor("#2196F3");
    setTaskType("Tarea");
    setDescription("");
    setDate(new Date());
    setTime(new Date());
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateTimeText}>
                    {dayjs().format("DD MMM YYYY")}
                  </Text>
                </View>
                <View style={styles.timeBox}>
                  <Text style={styles.dateTimeText}>
                    {dayjs().format("HH:mm A")}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Asignaturas */}
            <Text style={styles.sectionTitle}>Selecciona tu asignatura</Text>
            <View style={styles.subjectsGrid}>
              {subjects.map((m) => (
                <TouchableOpacity
                  key={m.materia_id}
                  style={[
                    styles.subjectButton,
                    subject === m.materia_id && styles.selectedSubjectButton,
                  ]}
                  onPress={() => setSubject(m.materia_id)}
                >
                  <Text style={styles.subjectButtonText}>{m.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Color */}
            <Text style={styles.sectionTitle}>Selecciona el color</Text>
            <View style={styles.colorsContainer}>
              {[
                "#2196F3",
                "#FFC107",
                "#4CAF50",
                "#673AB7",
                "#E1BEE7",
                "#F44336",
              ].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c },
                    selectedColor === c && styles.selectedColorCircle,
                  ]}
                  onPress={() => setSelectedColor(c)}
                >
                  {selectedColor === c && (
                    <View style={styles.colorCircleInner} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Tipo */}
            <Text style={styles.sectionTitle}>Tipo de pendiente</Text>
            <View style={styles.typeContainer}>
              {["Examen", "Tarea"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeButton,
                    taskType === t && styles.selectedTypeButton,
                  ]}
                  onPress={() => setTaskType(t)}
                >
                  <Text style={styles.typeButtonText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Descripción */}
            <Text style={styles.sectionTitle}>
              ¿Cuál es la tarea pendiente?
            </Text>
            <View style={styles.descriptionContainer}>
              <TextInput
                style={styles.descriptionInput}
                multiline
                value={description}
                onChangeText={setDescription}
                placeholder="Describe tu tarea aquí..."
                placeholderTextColor="#A0C4F2"
                maxLength={100}
              />
              <Text style={styles.charCount}>{description.length}/100</Text>
            </View>

            {/* Selector de fecha y hora */}
            <Text style={styles.sectionTitle}>Escoger fecha y hora</Text>
            <View style={styles.dateTimePickerContainer}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimePickerText}>{formattedDate}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimePickerText}>{formattedTime}</Text>
              </TouchableOpacity>
            </View>

            {/* Modal fecha */}
            {showDatePicker && (
              <Modal transparent animationType="fade">
                <View style={styles.pickerOverlay}>
                  <View style={styles.pickerModal}>
                    <Text style={styles.pickerTitle}>Selecciona una fecha</Text>
                    <Calendar
                      onDayPress={(day: { dateString: string | number | Date; }) => {
                        const selectedDate = dayjs(day.dateString).toDate();
                        setDate(selectedDate);
                        setShowDatePicker(false);
                      }}
                      markedDates={{
                        [formattedDate]: {
                          selected: true,
                          selectedColor: "#2196F3",
                        },
                      }}
                      theme={{
                        backgroundColor: "#ffffff",
                        calendarBackground: "#ffffff",
                        textSectionTitleColor: "#b6c1cd",
                        selectedDayBackgroundColor: "#2196F3",
                        selectedDayTextColor: "#ffffff",
                        todayTextColor: "#2196F3",
                        dayTextColor: "#2d4150",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.calendarCancelButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.pickerCancel}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}

            {/* Modal hora */}
            {showTimePicker && (
              <Modal transparent animationType="fade">
                <View style={styles.pickerOverlay}>
                  <View style={styles.pickerModal}>
                    <Text style={styles.pickerTitle}>Selecciona una hora</Text>
                    <ScrollView style={{ maxHeight: 200 }}>
                      {[...Array(24)].map((_, h) =>
                        ["00", "15", "30", "45"].map((m) => {
                          const opt = `${h.toString().padStart(2, "0")}:${m}`;
                          return (
                            <TouchableOpacity
                              key={opt}
                              style={styles.pickerOption}
                              onPress={() => {
                                const dt = dayjs()
                                  .hour(h)
                                  .minute(parseInt(m))
                                  .toDate();
                                setTime(dt);
                                setShowTimePicker(false);
                              }}
                            >
                              <Text>{opt}</Text>
                            </TouchableOpacity>
                          );
                        })
                      )}
                    </ScrollView>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={styles.pickerCancel}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}

            {/* Botón Finalizar */}
            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinish}
            >
              <Text style={styles.finishButtonText}>
                {taskToEdit ? "Guardar cambios" : "Finalizar"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "#A9D4FB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: "row",
  },
  dateBox: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  timeBox: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dateTimeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 15,
  },
  subjectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subjectButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "48%",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedSubjectButton: {
    backgroundColor: "#1976D2",
  },
  subjectButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  colorsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColorCircle: {
    borderWidth: 2,
    borderColor: "white",
  },
  colorCircleInner: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: "white",
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  typeButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  selectedTypeButton: {
    backgroundColor: "#2196F3",
  },
  typeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  descriptionContainer: {
    backgroundColor: "#64B5F6",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    minHeight: 150,
  },
  descriptionInput: {
    color: "white",
    fontSize: 16,
    flex: 1,
    textAlignVertical: "top",
  },
  charCount: {
    color: "white",
    textAlign: "right",
    marginTop: 5,
  },
  dateTimePickerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  datePickerButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "48%",
    alignItems: "center",
  },
  timePickerButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "48%",
    alignItems: "center",
  },
  dateTimePickerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  pickerOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  pickerCancel: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  calendarCancelButton: {
    marginTop: 10,
    padding: 10,
  },
  finishButton: {
    backgroundColor: "#2196F3",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddTaskModal;
