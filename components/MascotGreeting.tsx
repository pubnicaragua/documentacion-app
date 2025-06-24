import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const MascotGreeting = () => {
  return (
    <View style={styles.container}>
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>¿Como te sientes ahora?</Text>
      </View>
      <Image source={require("../assets/icon.png")} style={styles.mascotImage} />
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Registro de la tarde</Text>
      </TouchableOpacity>
      <View style={styles.pointsContainer}>
        <Ionicons name="happy" size={24} color="#FFD700" />
        <Text style={styles.pointsText}>500</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  speechBubble: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
  },
  speechText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  mascotImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  registerButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  registerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 20,
    bottom: 0,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
})

export default MascotGreeting
