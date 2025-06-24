import { StyleSheet, View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface PointsBadgeProps {
  points: number
}

const PointsBadge = ({ points }: PointsBadgeProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="star" size={20} color="#FFD700" />
      <Text style={styles.pointsText}>{points}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  pointsText: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
})

export default PointsBadge
