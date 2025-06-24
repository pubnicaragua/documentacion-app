import { View, TextInput, Text, StyleSheet } from "react-native"

interface DiaryInputProps {
  value: string
  onChangeText: (text: string) => void
  maxLength?: number
}

const DiaryInput = ({ value, onChangeText, maxLength = 1000 }: DiaryInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        textAlignVertical="top"
        placeholder="Escribe aquí tus pensamientos..."
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
      />
      <View style={styles.footer}>
        <Text style={styles.charCount}>
          {value.length}/{maxLength}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#64B5F6",
    borderRadius: 15,
    padding: 15,
    flex: 1,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  charCount: {
    color: "white",
    fontSize: 14,
  },
})

export default DiaryInput
