"use client"
import { useState } from "react"
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native"
import DiaryCard from "./DiaryCard"
import DiaryModal from "../modals/DiaryModal"
import { API_ENDPOINTS, fetchAuthApi } from "config/api"
import { useAuth } from "context/AuthContext"

const CARD_WIDTH = 80 
const CARD_MARGIN = 10 

const DiarySection = () => {
  const [diaryModalVisible, setDiaryModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const {  user } = useAuth();

  const dates = [
    { day: "Hoy", date: "25", month: "Marzo", isActive: true },
    { day: "24", date: "24", month: "Marzo", isActive: false },
    { day: "23", date: "23", month: "Marzo", isActive: false },
    { day: "22", date: "22", month: "Marzo", isActive: false },
    { day: "21", date: "21", month: "Marzo", isActive: false },
  ]
const handleDiaryClose=()=>{
   setDiaryModalVisible(true)
}
  const handleDiaryCardPress = async (day: string, date: string, month: string) => {
    setSelectedDate(`${date} de ${month}`)
    setDiaryModalVisible(true)
   /*  await fetchAuthApi(API_ENDPOINTS.ALERTA, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                  alumno_id: user?.alumno_id,
                  alerta_regla_id: 1, // reemplaza con valor real
                  fecha_generada: new Date().toISOString(), // ejemplo de fecha actual
                  alerta_origen_id: 1, // reemplaza con valor real
                  prioridad_id: 2, // reemplaza con valor real
                  severidad_id: 2, // reemplaza con valor real
                  leida: false,
                  estado: "pendiente",
                  alertas_tipo_alerta_tipo_id: 2, // reemplaza con valor real
                }),
                });*/
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diario</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleDiaryCardPress(item.day, item.date, item.month)}
            style={styles.cardWrapper}
          >
            <DiaryCard day={item.day} date={item.date} month={item.month} isActive={item.isActive} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <DiaryModal
        visible={diaryModalVisible}
        onClose={() => setDiaryModalVisible(false)}
        date={selectedDate || "25 de Marzo"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  scrollContent: {
    paddingRight: 20,
  },
  cardWrapper: {
    marginRight: CARD_MARGIN, 
  }
})

export default DiarySection