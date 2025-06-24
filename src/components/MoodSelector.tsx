import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"

interface MoodOption {
  id: number
  label: string
  icon: any // En una app real, usaríamos un tipo más específico
}

interface MoodSelectorProps {
  onSelectMood: (moodId: number) => void
  selectedMood: number | null
}

const moods: MoodOption[] = [
  { id: 1, label: "Muy mal", icon: require("../assets/icon.png") },
  { id: 2, label: "Mal", icon: require("../assets/icon.png") },
  { id: 3, label: "Normal", icon: require("../assets/icon.png") },
  { id: 4, label: "Bien", icon: require("../assets/icon.png") },
  { id: 5, label: "Muy bien", icon: require("../assets/icon.png") },
]

const MoodSelector = ({ onSelectMood, selectedMood }: MoodSelectorProps) => {
  return (
    <View style={styles.container}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.id}
          style={[styles.moodOption, selectedMood === mood.id && styles.selectedMood]}
          onPress={() => onSelectMood(mood.id)}
        >
          <Image source={mood.icon} style={styles.moodIcon} />
          <Text style={styles.moodLabel}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#64B5F6",
    borderRadius: 15,
    padding: 10,
    width: "100%",
  },
  moodOption: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  selectedMood: {
    backgroundColor: "#2196F3",
  },
  moodIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  moodLabel: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
})

export default MoodSelector
