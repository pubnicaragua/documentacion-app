"use client"
import { StatusBar } from "expo-status-bar"
import { useRef, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Modal, Animated, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SvgXml } from "react-native-svg"
import { almialertsvg, almisossvg, backgroundHomesvg } from "@/indexsvfg"
import { useNavigation } from "@react-navigation/native"

interface SOSModalProps {
  visible: boolean
  onClose: () => void
  onRequestHelp: () => void
  onReport: () => void
}

const SOSModal = ({ visible, onClose, onRequestHelp, onReport }: SOSModalProps) => {
  const navigation = useNavigation()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(100)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
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
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  const handleRequestHelp = () => {
    onClose() // Cerrar el modal primero
    setTimeout(() => {
      navigation.navigate("SOSHelp" as never)
    }, 300) // Pequeño retraso para permitir que la animación de cierre comience
  }

  const handleReport = () => {
    onClose() // Cerrar el modal primero
    setTimeout(() => {
      navigation.navigate("SOSReport" as never)
    }, 300) // Pequeño retraso para permitir que la animación de cierre comience
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <StatusBar backgroundColor="black" style="light" />
      <ScrollView>
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.header}>
              <SvgXml xml={backgroundHomesvg} style={styles.fixedBackground} />
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 24, fontWeight: "900", color: "white" }}>SOS</Text>
                <Text style={{ fontSize: 24, color: "white" }}> Alma</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.helpOption} onPress={handleRequestHelp}>
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpTitle}>Busquemos</Text>
                  <Text style={styles.helpHighlight}>ayuda</Text>
                  <Text style={styles.helpTitle}>juntos</Text>
                </View>
                <View style={styles.helpImageContainer}>
                  <SvgXml xml={almisossvg} height="100%" style={{ transform: [{ scale: 1.5 }] }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reportOption} onPress={handleReport}>
                <View style={styles.reportImageContainer}>
                  <SvgXml xml={almialertsvg} style={{ transform: [{ scale: 1.5 }] }} />
                </View>
                <View style={styles.reportTextContainer}>
                  <Text style={styles.reportQuestion}>¿Pasa algo?</Text>
                  <Text style={styles.reportAction}>Denunciemoslo</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  fixedBackground: {
    transform: [{ scaleY: 0.4 }],
    position: "absolute",
    top: -100,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  modalContent: {
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    borderWidth: 0.5,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    gap: 30,
  },
  helpOption: {
    backgroundColor: "#FF4757",
    borderRadius: 15,
    paddingLeft: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  helpHighlight: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  helpImageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mascotImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  reportOption: {
    backgroundColor: "#5F399F",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  reportImageContainer: {
    marginRight: 20,
  },
  reportImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  reportTextContainer: {
    flex: 1,
  },
  reportQuestion: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  reportAction: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
})

export default SOSModal
