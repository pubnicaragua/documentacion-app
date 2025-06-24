import { RespuestaPosible } from "data/RespuestaPosible"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"

interface EmotionGridProps {
  emotions: RespuestaPosible[]
  selectedEmotion: number | null
  onSelectEmotion: (emotion: number) => void
}

const EmotionGrid = ({ emotions, selectedEmotion, onSelectEmotion }: EmotionGridProps) => {
  // Dividir las emociones en pares para mostrarlas en dos columnas
  const emotionPairs = []
  for (let i = 0; i < emotions.length; i += 2) {
    emotionPairs.push(emotions.slice(i, i + 2))
  }

  return (
    <View style={styles.container}>
      {emotionPairs.map((pair, index) => (
        <View key={index} style={styles.row}>
          {pair.map((emotion) => (
            <TouchableOpacity
              key={emotion.respuesta_posible_id}
              style={[styles.emotionButton, selectedEmotion === emotion.respuesta_posible_id && styles.selectedEmotionButton]}
              onPress={() => onSelectEmotion(emotion.respuesta_posible_id)}
            >
              <Text style={styles.emotionText}>{emotion.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  emotionButton: {
    backgroundColor: "#64B5F6",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "48%",
    alignItems: "center",
  },
  selectedEmotionButton: {
    backgroundColor: "#2196F3",
  },
  emotionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default EmotionGrid
