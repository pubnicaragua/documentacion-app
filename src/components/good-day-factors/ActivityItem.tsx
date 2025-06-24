import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ActivityItemProps {
  activity: string
  selected: boolean
  onPress: () => void
}

const ActivityItem = ({ activity, selected, onPress }: ActivityItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {selected && <Ionicons name="checkmark-circle" size={20} color="#2196F3" style={styles.icon} />}
      <Text style={[styles.text, selected && styles.textSelected]}>{activity}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 15,
    padding: 15,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  containerSelected: {
    backgroundColor: "white",
  },
  icon: {
    marginRight: 5,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  textSelected: {
    color: "#333",
  },
})

export default ActivityItem
