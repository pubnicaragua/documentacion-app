import { StyleSheet, Text, View, ScrollView } from "react-native"
import DiaryCard from "./DiaryCard"

const DiarySection = () => {
  const dates = [
    { day: "Hoy", date: "25", month: "Marzo" },
    { day: "24", date: "24", month: "Marzo" },
    { day: "23", date: "23", month: "Marzo" },
    { day: "22", date: "22", month: "Marzo" },
    { day: "21", date: "21", month: "Marzo" },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diario</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dates.map((item, index) => (
          <DiaryCard key={index} day={item.day} date={item.date} month={item.month} isActive={index === 0} />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
})

export default DiarySection
