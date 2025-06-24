"use client"
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import DateTimeHeader from "../components/task-registration/DateTimeHeader"
import CloseButton from "../components/common/CloseButton"
import GreetingBubble from "../components/common/GreetingBubble"
import MascotImage from "../components/common/MascotImage"
import EmotionsSelector from "../components/task-registration/EmotionsSelector"
import SupportMessage from "../components/task-registration/SupportMessage"
import ContinueButton from "../components/common/ContinueButton"

const TaskRegistrationScreen = () => {
  const navigation = useNavigation<any>()

  const handleClose = () => {
    navigation.goBack()
  }

  const handleContinue = () => {
    navigation.navigate("MoodSelection")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <DateTimeHeader />
          <CloseButton onPress={handleClose} />
        </View>

        <View style={styles.content}>
          <GreetingBubble name="Paolo" question="¿Como te sientes?" />
          <MascotImage />
          <EmotionsSelector />
          <SupportMessage />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton onPress={handleContinue} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9D4FB",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  footer: {
    padding: 20,
  },
})

export default TaskRegistrationScreen
