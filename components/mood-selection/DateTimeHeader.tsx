import { StyleSheet, View } from "react-native"
import DateTimeDisplay from "../common/DateTimeDisplay"

const DateTimeHeader = () => {
  return (
    <View style={styles.container}>
      <DateTimeDisplay />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
})

export default DateTimeHeader
