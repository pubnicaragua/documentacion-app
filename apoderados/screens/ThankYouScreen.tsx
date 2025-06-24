"use client"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import BackButton from "../components/common/BackButton"
import CloseButton from "../components/common/CloseButton"
import ProgressBar from "../components/common/ProgressBar"
import ContinueButton from "../components/common/ContinueButton"
import CelebratingMascot from "../components/thank-you/CelebratingMascot"
import MessageBubble from "../components/common/MessageBubble"

const ThankYouScreen = () => {
  const navigation = useNavigation()

  const handleBack = () => {
    navigation.goBack()
  }

  const handleClose = () => {
    navigation.navigate("MainTabs")
  }

  const handleContinue = () => {
    navigation.navigate("MainTabs", { screen: "Inicio" })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <CloseButton onPress={handleClose} />
      </View>

      <ProgressBar progress={1.0} />

      <ScrollView contentContainerStyle={styles.content}>
        <MessageBubble message="¡Muchas gracias por responder!" />

        <CelebratingMascot />

        <View style={styles.messageContainer}>
          <Text style={styles.message}>Gracias por compartir conmigo cómo te sientes.</Text>

          <Text style={styles.message}>
            Reflexionar sobre tu día y expresar tus emociones te ayuda a conocerte mejor.
          </Text>

          <Text style={styles.message}>Recuerda que siempre estaré aquí para escucharte cuando lo necesites.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton onPress={handleContinue} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9D4FB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 40, // Para dar espacio a la barra de estado
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  messageContainer: {
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
  footer: {
    padding: 20,
  },
})

export default ThankYouScreen
