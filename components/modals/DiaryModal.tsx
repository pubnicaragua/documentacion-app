"use client"

import { useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Image
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface DiaryModalProps {
  visible: boolean
  onClose: () => void
  date?: string
  mood?: string
  diaryEntry?: string
}

const DiaryModal = ({
  visible,
  onClose,
  date = "25 de Marzo",
  mood = "",
  diaryEntry = "",
}: DiaryModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Diario</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <View style={styles.mascotContainer}>
                <Image source={require("../../assets/icon.png")} style={styles.mascotImage} />
                <Text style={styles.dateText}>{date}</Text>
              </View>

              <View style={styles.waveContainer}>
                <View style={styles.wave} />
              </View>

              <ScrollView style={styles.contentContainer} contentContainerStyle={styles.contentScroll}>
                <View style={styles.moodSection}>
                  <Text style={styles.sectionTitle}>Como estuve hoy</Text>
                  <Text style={styles.moodText}>{mood}</Text>
                </View>

                <View style={styles.diarySection}>
                  <Text style={styles.sectionTitle}>Querido diario</Text>
                  <Text style={styles.diaryText}>{diaryEntry}</Text>
                </View>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#A9D4FB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  mascotContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#A9D4FB",
  },
  mascotImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  waveContainer: {
    height: 50,
    backgroundColor: "#A9D4FB",
    position: "relative",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  contentScroll: {
    padding: 20,
    paddingTop: 0,
  },
  moodSection: {
    marginBottom: 20,
  },
  diarySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  moodText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  diaryText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
})

export default DiaryModal
