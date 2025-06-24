"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"

const days = [
  { id: 1, name: "Dom" },
  { id: 2, name: "Lun" },
  { id: 3, name: "Mar" },
  { id: 4, name: "Mie" },
  { id: 5, name: "Jue" },
  { id: 6, name: "Ayer" },
  { id: 7, name: "Hoy" },
]

const DaySelector = () => {
  const [selectedDay, setSelectedDay] = useState(7)

  return (
    <View style={styles.container}>
      {days.map((day) => (
        <TouchableOpacity
          key={day.id}
          style={[styles.dayButton, selectedDay === day.id && styles.selectedDay]}
          onPress={() => setSelectedDay(day.id)}
        >
          <Text style={[styles.dayText, selectedDay === day.id && styles.selectedDayText]}>{day.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
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
    backgroundColor: "white",
  },
  dayText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "#2196F3",
  },
})

export default DaySelector
