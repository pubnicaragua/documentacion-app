import { View, Text, StyleSheet, Image } from "react-native"

interface MascotMessageProps {
  message: string
  points?: number
}

const MascotMessage = ({ message, points }: MascotMessageProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require("../../../assets/almis/almiefitnes.png")} style={styles.mascotImage} />
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
          {points && (
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>+{points} puntos</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  mascotImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    borderBottomLeftRadius: 0,
  },
  message: {
    fontSize: 14,
    color: "#333",
    marginBottom: typeof points === "number" ? 5 : 0,
  },
  pointsContainer: {
    backgroundColor: "#4CAF50",
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  pointsText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default MascotMessage
