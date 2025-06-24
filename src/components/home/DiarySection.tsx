"use client"
import { useState, useEffect } from "react"
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import DiaryCard from "./DiaryCard"
import DiaryModal from "../modals/DiaryModal"
import { API_ENDPOINTS, fetchApi, fetchAuthApi } from "config/api"
import { useAuth } from "context/AuthContext"
import { useProfile } from "context/ProfileContext"

const CARD_WIDTH = 80
const CARD_MARGIN = 10

interface DiaryEntry {
  alumno_diario_id: number
  alumno_id: number
  titulo: string
  descripcion: string
  fecha: string
}

const DiarySection = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [diaryModalVisible, setDiaryModalVisible] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
    const { user } = useAuth()
    const {agregarDiario,diarioAgregado} = useProfile()
const alumnoId = user?.alumno_id
  useEffect(() => {  
    const fetchDiaryEntries = async () => {  
      if (!alumnoId) return  
        
      try {  
        setLoading(true)  
        const diarios = await fetchAuthApi(  
          `${API_ENDPOINTS.DIARIO}?alumno_id=${alumnoId}`  
        )  
        setDiaryEntries(diarios)  
      } catch (err) {  
        setError(err instanceof Error ? err.message : 'Error desconocido')  
        console.error("Error fetching diary entries:", err)  
      } finally {  
        setLoading(false)  
      }  
    }  
  
    fetchDiaryEntries()  
  }, [alumnoId, diarioAgregado]) 

  // Función para formatear la fecha en el formato deseado para las tarjetas
  const formatDateForCard = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    
    // Comprobar si es hoy
    if (date.toDateString() === today.toDateString()) {
      return {
        day: "Hoy",
        date: date.getDate().toString(),
        month: date.toLocaleString('es-ES', { month: 'long' }),
        isActive: true
      }
    }
    
    return {
      day: date.getDate().toString(),
      date: date.getDate().toString(),
      month: date.toLocaleString('es-ES', { month: 'long' }),
      isActive: false
    }
  }

  // Función para formatear la fecha para el modal
  const formatDateForModal = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate()} de ${date.toLocaleString('es-ES', { month: 'long' })}`
  }

  const handleDiaryCardPress = (entry: DiaryEntry) => {
    setSelectedEntry(entry)
    setDiaryModalVisible(true)
  }

  
  const handleDelete = async (diario_id: number) => {  
    try {  
       await fetchAuthApi(`${API_ENDPOINTS.DIARIO}/${diario_id}`, {  
        method: 'DELETE'  
      })  
      agregarDiario(true)
    } catch (error) {  
      console.error('Error deleting diary:', error)  
    }  
  }  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar el diario: {error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diario</Text>

      {diaryEntries.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
        >
          {diaryEntries.map((entry) => {
            const cardData = formatDateForCard(entry.fecha)
            return (
              <TouchableOpacity
                key={entry.alumno_diario_id}
                onPress={() => handleDiaryCardPress(entry)}
                style={styles.cardWrapper}
              >
                <DiaryCard 
                  day={cardData.day} 
                  date={cardData.date} 
                  month={cardData.month} 
                  isActive={cardData.isActive} 
                />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      ) : (
        <Text style={styles.noEntriesText}>No hay entradas en el diario</Text>
      )}

      {selectedEntry && (
        <DiaryModal
        diario_id={selectedEntry.alumno_diario_id}
          visible={diaryModalVisible}
          onClose={() => setDiaryModalVisible(false)}
          onDelete={handleDelete}
          date={formatDateForModal(selectedEntry.fecha)}
          title={selectedEntry.titulo}
          description={selectedEntry.descripcion}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
    minHeight: 120, // Para mantener el espacio mientras carga
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
  },
  noEntriesText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
})

export default DiarySection

