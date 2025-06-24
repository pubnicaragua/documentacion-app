import { StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface CloseButtonProps {
  onPress: () => void
}

const CloseButton = ({ onPress }: CloseButtonProps) => {
  return (
    <TouchableOpacity style={styles.closeButton} onPress={onPress}>
      <Ionicons name="close" size={24} color="black" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default CloseButton
