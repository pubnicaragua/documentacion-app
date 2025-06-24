import { StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface BackButtonProps {
  onPress: () => void
}

const BackButton = ({ onPress }: BackButtonProps) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default BackButton
