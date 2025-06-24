import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const StreakCounter = () => {
  return (
    <>
      <View style={styles.line} />
      <View style={styles.container}>
        <View style={styles.streakItem}>
          <Text style={styles.streakText}>Mi racha actual</Text>
          <View style={styles.streakValue}>
            <Ionicons name="flame" size={20} color="#FF9800" />
            <Text style={styles.streakNumber}>x0</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.streakItem}>
          <Text style={styles.streakText}>Mi mejor racha</Text>
          <View style={styles.streakValue}>
            <Ionicons name="flame" size={20} color="#FF9800" />
            <Text style={styles.streakNumber}>x0</Text>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  line: {
    height: 0.5,
    backgroundColor: "white",
    width: "100%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 5,
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
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "white",
  },
})

export default StreakCounter
