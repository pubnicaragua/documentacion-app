import { StyleSheet, Text, View } from "react-native"

const DateTimeDisplay = () => {
  // En una aplicación real, usaríamos Date para obtener la fecha y hora actual
  // Pero para este ejemplo, usaremos los valores del diseño
  const date = "25 mar. 2025"
  const time = "14:55 pm"

  return (
    <View style={styles.container}>
      <View style={styles.dateBox}>
        <Text style={styles.text}>{date}</Text>
      </View>
      <View style={styles.timeBox}>
        <Text style={styles.text}>{time}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  dateBox: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  timeBox: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default DateTimeDisplay
