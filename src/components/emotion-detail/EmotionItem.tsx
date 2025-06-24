import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface EmotionItemProps {
  emotion: string
  selected: boolean
  onPress: () => void
}

const EmotionItem = ({ emotion, selected, onPress }: EmotionItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{emotion}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 15,
    padding: 15,
    width: "48%",
    alignItems: "center",
    marginBottom: 15,
  },
  containerSelected: {
    backgroundColor: "white",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  textSelected: {
    color: "#2196F3",
  },
})

export default EmotionItem
