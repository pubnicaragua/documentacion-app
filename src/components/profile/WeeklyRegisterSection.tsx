import { StyleSheet, View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import colors from "../../constants/colors"

interface WeeklyRegisterSectionProps {
  currentStreak: number
  bestStreak: number
}

const WeeklyRegisterSection = ({ currentStreak, bestStreak }: WeeklyRegisterSectionProps) => {
  // Días de la semana
  const days = [
    { id: 1, name: "Dom", completed: false },
    { id: 2, name: "Lun", completed: false },
    { id: 3, name: "Mar", completed: false },
    { id: 4, name: "Mie", completed: false },
    { id: 5, name: "Jue", completed: false },
    { id: 6, name: "Ayer", completed: true },
    { id: 7, name: "Hoy", completed: false },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Registro semanal</Text>

      <View style={styles.weekContainer}>
        <View style={styles.daysContainer}>
          {days.map((day) => (
            <View key={day.id} style={styles.dayItem}>
              <View style={[styles.dayCircle, day.completed && styles.completedDay]}>
                {day.completed && <Ionicons name="checkmark" size={24} color="white" />}
              </View>
              <Text style={styles.dayText}>{day.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.streaksContainer}>
          <View style={styles.streakItem}>
            <Text style={styles.streakText}>Mi racha actual</Text>
            <View style={styles.streakValue}>
              <Ionicons name="flame" size={20} color="#FF9800" />
              <Text style={styles.streakNumber}>x{currentStreak}</Text>
            </View>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakItem}>
            <Text style={[styles.streakText, { marginLeft: 5 }]}>Mi mejor racha</Text>
            <View style={styles.streakValue}>
              <Ionicons name="flame" size={20} color="#FF9800" />
              <Text style={styles.streakNumber}>x{bestStreak}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  weekContainer: {
    backgroundColor: colors.primaryBlueMiddles,
    borderRadius: 15,
    padding: 15,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dayItem: {
    alignItems: "center",
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  completedDay: {
    backgroundColor: colors.primaryBlueStrong,
  },
  dayText: {
    color: "white",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "white",
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
    marginRight: 2,
  },
  streakValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakNumber: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  streakDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "white",
  },
})

export default WeeklyRegisterSection
