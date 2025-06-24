"use client"  
  
import { useState, useEffect } from "react"  
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"  
import { Ionicons } from "@expo/vector-icons"  
import { fetchAuthApi, API_ENDPOINTS } from "config/api"  
import { useAuth } from "context/AuthContext"  
  
interface WeeklyRegister {  
  id: number,  
  completed: boolean,  
  name: string  
}  
  
interface DaySelectorProps {  
  currentStreak?: number  
  bestStreak?: number  
}  
  
const DaySelector = ({ currentStreak = 0, bestStreak = 0 }: DaySelectorProps) => {  
  const [days, setDays] = useState<WeeklyRegister[]>([])  
  const [selectedDay, setSelectedDay] = useState<number | null>(null)  
  const { user } = useAuth()  
  
  useEffect(() => {  
    obtener_registro_semanal()  
  }, [])  
  
  // Establecer el día seleccionado por defecto al primer día completado  
  useEffect(() => {  
    if (days.length > 0 && selectedDay === null) {  
      const firstCompletedDay = days.find(day => day.completed)  
      if (firstCompletedDay) {  
        setSelectedDay(firstCompletedDay.id)  
      }  
    }  
  }, [days, selectedDay])  
  
async function obtener_registro_semanal() {  
  try {  
    const response = await fetchAuthApi(  
      API_ENDPOINTS.REGISTRO_SEMANAL + "?alumno_id=" + user?.alumno_id,  
      {  
        method: "GET",  
      }  
    )  
    console.log(response)  
      
    // NO filtrar - mostrar todos los días  
    // const completedDays = response.filter((day: WeeklyRegister) => day.completed)  
      
    // Definir el orden cronológico correcto  
    const dayOrder = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb", "Ayer", "Hoy"]  
      
    // Ordenar TODOS los días según el orden cronológico  
    const sortedDays = response.sort((a: WeeklyRegister, b: WeeklyRegister) => {  
      const indexA = dayOrder.indexOf(a.name)  
      const indexB = dayOrder.indexOf(b.name)  
      return indexA - indexB  
    })  
      
    setDays(sortedDays)  
  } catch (error) {  
    console.error("Error al obtener registro semanal:", error)  
    // Fallback con todos los días (completados y no completados)  
    setDays([  
      { id: 7, name: "Dom", completed: false },  
      { id: 6, name: "Lun", completed: false },  
      { id: 5, name: "Mar", completed: false },  
      { id: 4, name: "Mie", completed: false },  
      { id: 3, name: "Jue", completed: true },  
      { id: 2, name: "Ayer", completed: true },  
      { id: 1, name: "Hoy", completed: true },  
    ])  
  }  
}
  
  const handleDayPress = (day: WeeklyRegister) => {  
    // Solo permitir selección si el día está completado  
    if (day.completed) {  
      setSelectedDay(day.id)  
    }  
  }  
  
  return (  
    <View style={styles.container}>  
      <View style={styles.daysContainer}>  
        {days.map((day) => (  
          <TouchableOpacity  
            key={day.id}  
            style={[  
              styles.dayButton,  
              selectedDay === day.id && styles.selectedDay,  
              day.completed && styles.completedDay,  
              !day.completed && styles.disabledDay  
            ]}  
            onPress={() => handleDayPress(day)}  
            disabled={!day.completed} // Deshabilitar si no está completado  
          >  
            <View style={styles.dayContent}>  
              {day.completed }  
              <Text   
                style={[  
                  styles.dayText,   
                  selectedDay === day.id && styles.selectedDayText,  
                  day.completed && styles.completedDayText,  
                  !day.completed && styles.disabledDayText  
                ]}  
              >  
                {day.name}  
              </Text>  
            </View>  
          </TouchableOpacity>  
        ))}  
      </View>  
        
      {/* Sección de rachas opcional */}  
      {(currentStreak > 0 || bestStreak > 0) && (  
        <>  
          <View style={styles.divider} />  
          <View style={styles.streaksContainer}>  
            <View style={styles.streakItem}>  
              <Text style={styles.streakText}>Racha actual</Text>  
              <View style={styles.streakValue}>  
                <Ionicons name="flame" size={16} color="#FF9800" />  
                <Text style={styles.streakNumber}>x{currentStreak}</Text>  
              </View>  
            </View>  
            <View style={styles.streakDivider} />  
            <View style={styles.streakItem}>  
              <Text style={styles.streakText}>Mejor racha</Text>  
              <View style={styles.streakValue}>  
                <Ionicons name="flame" size={16} color="#FF9800" />  
                <Text style={styles.streakNumber}>x{bestStreak}</Text>  
              </View>  
            </View>  
          </View>  
        </>  
      )}  
    </View>  
  )  
}  
  
const styles = StyleSheet.create({  
  container: {  
    paddingVertical: 10,  
  },  
  daysContainer: {  
    flexDirection: "row",  
    justifyContent: "space-between",  
  },  
  dayButton: {  
    width: 40,  
    height: 40,  
    borderRadius: 20,  
    backgroundColor: "rgba(255, 255, 255, 0.3)",  
    justifyContent: "center",  
    alignItems: "center",  
  },  
  selectedDay: {  
    backgroundColor: "#2196F3",  
  },  
  completedDay: {  
    backgroundColor: "#F4F4F5FF", // Color para días completados  
  },  
  disabledDay: {  
    backgroundColor: "#2196F3", // Color más tenue para días deshabilitados  
  },  
  dayContent: {  
    alignItems: "center",  
    justifyContent: "center",  
    position: "relative",  
  },  
  checkmark: {  
    position: "absolute",  
    top: -8,  
    right: -8,  
  },  
  dayText: {  
    color: "#2196F3",  
    fontWeight: "bold",  
    fontSize: 12,  
  },  
  selectedDayText: {  
    color: "#2196F3",  
  },  
  completedDayText: {  
    color: "#2196F3",  
  },  
  disabledDayText: {  
    color: "white", // Texto más tenue para días deshabilitados  
  },  
  divider: {  
    height: 1,  
    backgroundColor: "rgba(255, 255, 255, 0.3)",  
    marginVertical: 10,  
  },  
  streaksContainer: {  
    flexDirection: "row",  
    justifyContent: "space-around",  
    alignItems: "center",  
  },  
  streakItem: {  
    flexDirection: "row",  
    alignItems: "center",  
  },  
  streakText: {  
    color: "white",  
    marginRight: 5,  
    fontSize: 12,  
  },  
  streakValue: {  
    flexDirection: "row",  
    alignItems: "center",  
  },  
  streakNumber: {  
    color: "white",  
    fontWeight: "bold",  
    marginLeft: 3,  
    fontSize: 12,  
  },  
  streakDivider: {  
    width: 1,  
    height: 20,  
    backgroundColor: "rgba(255, 255, 255, 0.3)",  
  },  
})  
  
export default DaySelector