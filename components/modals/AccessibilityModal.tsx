"use client"
import { useRef, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Modal, Animated, ScrollView } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { SvgXml } from "react-native-svg"
import { almiesoon, almietalkback, backgroundHomesvg } from "@/indexsvfg"

interface AccessibilityModalProps {
  visible: boolean
  onClose: () => void
}

const AccessibilityModal = ({ visible, onClose }: AccessibilityModalProps) => {
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

  return (
    <Modal visible={visible} transparent animationType="none">
      <StatusBar backgroundColor="black" />
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
              <Text style={styles.title}>Accesibilidad</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={[styles.content, { marginTop: 50 }]}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Daltonismo</Text>
                <View style={styles.colorBoxesContainer}>
                  <View style={[styles.colorBox, { backgroundColor: "#FFF59D" }]} />
                  <View style={[styles.colorBox, { backgroundColor: "#B3E5FC" }]} />
                  <View style={[styles.colorBox, { backgroundColor: "#E1BEE7" }]} />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Talkback</Text>
                <View style={styles.talkbackContainer}>
                  <View style={styles.talkbackContent}>
                    <SvgXml xml={almietalkback} style={styles.almietalk} />
                    <View style={{ flexDirection: "column" }}>
                      <View style={styles.talkbackTextContainer}>
                        <Text style={styles.talkbackQuestion}>¿Deseas activar el</Text>
                        <Text style={styles.talkbackHighlight}>pulsar</Text>
                        <Text style={styles.talkbackQuestion}>para escuchar?</Text>
                      </View>
                      <View style={styles.talkbackButtonsContainer}>
                        <TouchableOpacity style={styles.talkbackButtonYes}>
                          <Text style={styles.talkbackButtonYesText}>Si</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.talkbackButtonNo}>
                          <Text style={styles.talkbackButtonNoText}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>

                </View>
              </View>

              <View style={[styles.section, { marginBottom: 50 }]}>
                <Text style={styles.sectionTitle}>Próximamente</Text>
                <View style={styles.comingSoonContainer}>
                  <Text style={styles.comingSoonText}>Más funciones próximamente</Text>
                  <SvgXml xml={almiesoon} style={styles.almiecoming} />
                </View>
              </View>
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
  modalContent: {
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    overflow: "hidden",
  },
  fixedBackground: {
    transform: [{ scaleY: .4 }],
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    position: "relative",
    zIndex: 1,
  },
  title: {
    color: "white",
    paddingTop: 20,
    fontSize: 28,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 45,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    position: "relative",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  colorBoxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorBox: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 10,
  },
  talkbackContainer: {
    backgroundColor: "#673AB7",
    borderRadius: 15,
    padding: 15,
    overflow: "hidden",
  },
  talkbackContent: {
    flexDirection: "row",
    // alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  talkbackTextContainer: {
    flex: 1,
    marginLeft: 30
  },
  talkbackQuestion: {
    color: "white",
    fontSize: 18,
  },
  talkbackHighlight: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  talkbackButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  talkbackButtonYes: {
    backgroundColor: "#E1BEE7",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  talkbackButtonYesText: {
    color: "#673AB7",
    fontWeight: "bold",
  },
  talkbackButtonNo: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  talkbackButtonNoText: {
    color: "#673AB7",
    fontWeight: "bold",
  },
  comingSoonContainer: {
    backgroundColor: "#2196F3",
    borderRadius: 15,
    alignItems: "center",
    position: "relative",
    height: 120,
    overflow: "hidden",
  },
  comingSoonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  almiecoming: {
    position: "absolute",
    bottom: 0,
    transform: [
      { scale: 1.2 }
    ]
  },
  almietalk: {
    position: "absolute",
    left: 0,
    bottom: -5,
    transform: [{ scale: 1.5 }]
  }
})

export default AccessibilityModal
