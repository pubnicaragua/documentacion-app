import { StyleSheet, Text, View } from "react-native"

interface DiaryCardProps {
  day: string
  date: string
  month: string
  isActive?: boolean
}

const DiaryCard = ({ day, date, month, isActive = false }: DiaryCardProps) => {
  return (
    <View style={[styles.container, isActive && styles.activeContainer]}> {/* 👈 Contenedor principal */}
      <View style={styles.dayContainer}>
        <Text style={[styles.day, isActive && styles.activeText]}>{day}</Text>
      </View>
      <View style={[styles.dateContainer, isActive && styles.activeDateContainer]}>
        <Text style={styles.month}>{month}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
  },
  activeContainer: {
    backgroundColor: "#2196F3",
  },
  dayContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A9D4FB",
  },
  dateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#64B5F6",
  },
  activeDateContainer: {
    backgroundColor: "#1E88E5",
  },
  day: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  activeText: {
    color: "white",
  },
  month: {
    fontSize: 16,
    color: "white",
  },
})

export default DiaryCard