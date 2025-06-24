import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
import ActivityIcon from "./ActivityIcon"

interface ActivityGridProps {
  selectedActivities: string[]
  onToggleActivity: (activity: string) => void
}

interface Activity {
  id: string
  label: string
  icon: string
}

const activities: Activity[] = [
  { id: "yo", label: "Yo", icon: "person-outline" },
  { id: "dormir", label: "Dormir", icon: "moon-outline" },
  { id: "comida", label: "Comida", icon: "fast-food-outline" },
  { id: "escuela", label: "Escuela", icon: "school-outline" },
  { id: "familia", label: "Familia", icon: "home-outline" },
  { id: "amigos", label: "Amigos", icon: "people-outline" },
  { id: "futbol", label: "Futbol", icon: "football-outline" },
  { id: "ejercicio", label: "Ejercicio", icon: "barbell-outline" },
  { id: "voleibol", label: "Voleibol", icon: "basketball-outline" },
  { id: "musica", label: "Musica", icon: "musical-note-outline" },
  { id: "videojuegos", label: "Videojuegos", icon: "game-controller-outline" },
  { id: "peliculas", label: "Películas", icon: "film-outline" },
]

const ActivityGrid = ({ selectedActivities, onToggleActivity }: ActivityGridProps) => {
  // Dividir las actividades en filas de 3
  const rows = []
  for (let i = 0; i < activities.length; i += 3) {
    rows.push(activities.slice(i, i + 3))
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[styles.activityButton, selectedActivities.includes(activity.id) && styles.selectedActivityButton]}
              onPress={() => onToggleActivity(activity.id)}
            >
              <ActivityIcon name={activity.icon} selected={selectedActivities.includes(activity.id)} />
              <Text style={styles.activityText}>{activity.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  activityButton: {
    backgroundColor: "#64B5F6",
    borderRadius: 10,
    padding: 15,
    width: "30%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedActivityButton: {
    backgroundColor: "#2196F3",
  },
  activityText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
})

export default ActivityGrid
