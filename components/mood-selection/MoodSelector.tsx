import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"
import { SvgXml } from "react-native-svg"
import { fineface, veryfineface, verysadface, sadface, neutralface } from "@/indexsvfg"
import { MoodOption } from "data/MoodOption"


interface MoodSelectorProps {
  onSelectMood: (moodId: number) => void
  selectedMood: number | null
    moods:MoodOption[]

}



const MoodSelector = ({ onSelectMood, selectedMood ,moods}: MoodSelectorProps) => {
  return (
    <View style={styles.container}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.id}
          style={[styles.moodOption, selectedMood === mood.id && styles.selectedMood]}
          onPress={() => onSelectMood(mood.id)}
        >
          <SvgXml xml={mood.icon} />
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
