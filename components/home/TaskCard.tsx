import { StyleSheet, Text, View } from "react-native"  
import { Ionicons } from "@expo/vector-icons"  
import { parseISO, differenceInDays } from "date-fns"  
import type { Task } from "../../types/types"  
import { es } from 'date-fns/locale';
interface TaskCardProps {  
  task: Task  
}  
  
const TaskCard = ({ task }: TaskCardProps) => {  
  console.log('card-tareas', task);  
    
  // Método para calcular días restantes desde un string de fecha  
 const calculateDaysFromDateString = (dateString: string): string => {
  try {
    console.log('duedate', dateString);

    // Ejemplo de entrada: "3 de junio a las 06:30 PM"
    // Necesitamos parsearla al formato adecuado
    const parsedDate = parse(dateString, "d 'de' MMMM 'a las' hh:mm a", new Date(), { locale: es });

    const today = new Date();
    const diffDays = differenceInDays(parsedDate, today);

    if (diffDays < 0) {
      return "Vencido";
    } else if (diffDays === 0) {
      return "Hoy";
    } else if (diffDays === 1) {
      return "Mañana";
    } else {
      return `Faltan ${diffDays} días`;
    }
  } catch (error) {
    console.error('Error calculando días:', error);
    return 'Sin Compromiso';
  }
};
  
  return (  
    <View style={[styles.container, { backgroundColor: task.color }]}>  
      <View style={styles.header}>  
        <Text style={styles.subject}>{task.subject}</Text>  
      </View>  
      <View style={styles.content}>  
        <Text style={styles.description}>{task.description}</Text>  
      </View>  
      <View style={styles.footer}>  
        <Ionicons name="time-outline" size={16} color="#555" />  
        <Text style={styles.deadline}>  
          {task.dueDate}  
        </Text>  
      </View>  
    </View>  
  )  
}  
  
const styles = StyleSheet.create({  
  container: {  
    width: 200,  
    height: 150,  
    borderRadius: 15,  
    marginRight: 15,  
    overflow: "hidden",  
  },  
  header: {  
    padding: 10,  
    borderBottomRightRadius: 20,  
    borderBottomLeftRadius: 20,  
    overflow: "hidden",  
    backgroundColor: "rgba(255, 255, 255, 0.3)",  
  },  
  subject: {  
    fontSize: 18,  
    fontWeight: "bold",  
    color: "white",  
    textAlign: "center",  
  },  
  content: {  
    flex: 1,  
    padding: 10,  
    justifyContent: "center",  
  },  
  description: {  
    fontSize: 16,  
    color: "white",  
  },  
  footer: {  
    flexDirection: "row",  
    alignItems: "center",  
    justifyContent: "center",  
    padding: 8,  
  },  
  deadline: {  
    marginLeft: 5,  
    color: "#555",  
  },  
})  
  
export default TaskCard