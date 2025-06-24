import { StyleSheet, View, TouchableOpacity, Text } from "react-native"

interface EmotionTypeSelectorProps {
  selectedType: string
  onSelectType: (type: string) => void
}

const EmotionTypeSelector = ({ selectedType, onSelectType }: EmotionTypeSelectorProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selectedType === "positive" && styles.selectedButton]}
        onPress={() => onSelectType("positive")}
      >
        <Text style={[styles.buttonText, selectedType === "positive" && styles.selectedButtonText]}>Positivo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedType === "negative" && styles.selectedButton]}
        onPress={() => onSelectType("negative")}
      >
        <Text style={[styles.buttonText, selectedType === "negative" && styles.selectedButtonText]}>Negativo</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#64B5F6",
    borderRadius: 25,
    marginVertical: 20,
    padding: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  selectedButtonText: {
    color: "white",
  },
})

export default EmotionTypeSelector
