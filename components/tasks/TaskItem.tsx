import { StyleSheet, View, Text } from "react-native"  
import { Ionicons } from "@expo/vector-icons"  
  
interface Task {  
  id: number  
  subject: string  
  description: string  
  dueDate: string  
  color: string  
}  
  
interface TaskItemProps {  
  task: Task  
}  
  
const TaskItem = ({ task }: TaskItemProps) => {  
  // Función para verificar si la tarea está vencida  
  const isTaskOverdue = (dueDate: string) => {  
    try {  
      // Parsear la fecha del formato "30 de marzo a las 11:55 AM"  
      const dateStr = dueDate.toLowerCase()  
      const currentDate = new Date()  
        
      // Mapeo de meses en español  
      const monthMap: { [key: string]: number } = {  
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,  
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,  
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11  
      }  
        
      // Extraer día y mes  
      const dayMatch = dateStr.match(/(\d+) de (\w+)/)  
      if (!dayMatch) return false  
        
      const day = parseInt(dayMatch[1])  
      const monthName = dayMatch[2]  
      const month = monthMap[monthName]  
        
      if (month === undefined) return false  
        
      // Crear fecha de vencimiento (asumiendo año actual)  
      const taskDate = new Date(currentDate.getFullYear(), month, day)  
        
      // Si la fecha ya pasó este año, comparar con el año actual  
      return taskDate < currentDate  
    } catch (error) {  
      return false  
    }  
  }  
  
  const isOverdue = isTaskOverdue(task.dueDate)  
  
  return (  
    <View style={[styles.container, isOverdue && styles.overdueContainer]}>  
      <View style={[styles.subjectContainer, { backgroundColor: task.color }]}>  
        <Text style={styles.subjectText}>{task.subject}</Text>  
        {isOverdue && (  
          <View style={styles.overdueIndicator}>  
            <Ionicons name="warning" size={16} color="white" />  
          </View>  
        )}  
      </View>  
      <View style={[styles.descriptionContainer, { backgroundColor: lightenColor(task.color, 0.7) }]}>  
        <Text style={styles.descriptionText}>{task.description}</Text>  
        <View style={styles.dueDateContainer}>  
          <Ionicons   
            name="time-outline"   
            size={16}   
            color={isOverdue ? "#d32f2f" : "#555"}   
          />  
          <Text style={[styles.dueDateText, isOverdue && styles.overdueDateText]}>  
            {task.dueDate}  
          </Text>  
          {isOverdue && (  
            <Text style={styles.overdueLabel}> (Vencida)</Text>  
          )}  
        </View>  
      </View>  
    </View>  
  )  
}  
  
// Función para aclarar un color (simulando rgba con opacidad)  
const lightenColor = (color: string, factor: number) => {  
  const r = Number.parseInt(color.slice(1, 3), 16)  
  const g = Number.parseInt(color.slice(3, 5), 16)  
  const b = Number.parseInt(color.slice(5, 7), 16)  
  
  const lightenValue = (value: number) => Math.round(value + (255 - value) * factor)  
  
  const rNew = lightenValue(r)  
  const gNew = lightenValue(g)  
  const bNew = lightenValue(b)  
  
  return `#${rNew.toString(16).padStart(2, "0")}${gNew.toString(16).padStart(2, "0")}${bNew.toString(16).padStart(2, "0")}`  
}  
  
const styles = StyleSheet.create({  
  container: {  
    borderRadius: 10,  
    overflow: "hidden",  
    marginBottom: 15,  
  },  
  overdueContainer: {  
    borderWidth: 2,  
    borderColor: "#d32f2f",  
  },  
  subjectContainer: {  
    padding: 15,  
    alignItems: "center",  
    flexDirection: "row",  
    justifyContent: "center",  
  },  
  subjectText: {  
    color: "white",  
    fontWeight: "bold",  
    fontSize: 18,  
  },  
  overdueIndicator: {  
    marginLeft: 8,  
  },  
  descriptionContainer: {  
    padding: 15,  
  },  
  descriptionText: {  
    fontSize: 16,  
    marginBottom: 10,  
  },  
  dueDateContainer: {  
    flexDirection: "row",  
    alignItems: "center",  
    justifyContent: "flex-end",  
  },  
  dueDateText: {  
    marginLeft: 5,  
    color: "#555",  
    fontSize: 14,  
  },  
  overdueDateText: {  
    color: "#d32f2f",  
    fontWeight: "bold",  
  },  
  overdueLabel: {  
    color: "#d32f2f",  
    fontSize: 12,  
    fontWeight: "bold",  
  },  
})  
  
export default TaskItem