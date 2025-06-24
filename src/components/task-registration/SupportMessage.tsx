import { StyleSheet, View, Text } from "react-native"

const SupportMessage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Recuerda que no estás solo, estoy aquí para acompañarte en todo momento.</Text>
      <Text style={styles.message}>
        A veces los días pueden ser geniales y otras veces un poco difíciles, y eso está bien.
      </Text>
      <Text style={styles.message}>No tienes que guardarte todo, quiero escucharte y ayudarte como un buen amigo.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  message: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 24,
  },
})

export default SupportMessage
