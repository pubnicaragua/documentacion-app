import { StyleSheet, View, Text } from "react-native"

interface MessageBubbleProps {
  message: string
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
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
    maxWidth: "80%",
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default MessageBubble
