import { StyleSheet, View, Text } from "react-native"

interface GreetingBubbleProps {
  name: string
  question: string
}

const GreetingBubble = ({ name, question }: GreetingBubbleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hola <Text style={styles.name}>{name}</Text>,
      </Text>
      <Text style={styles.question}>{question}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginVertical: 20,
    width: "80%",
  },
  greeting: {
    fontSize: 24,
    textAlign: "center",
  },
  name: {
    fontWeight: "bold",
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default GreetingBubble
