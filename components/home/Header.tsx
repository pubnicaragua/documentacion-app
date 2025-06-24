"use client";

import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SOSModal from "../modals/SOSModal";
import AccessibilityModal from "../modals/AccessibilityModal";
import { useAuth } from "context/AuthContext";

const Header = () => {
  const [sosModalVisible, setSOSModalVisible] = useState(false);
  const [accessibilityModalVisible, setAccessibilityModalVisible] =
    useState(false);
  const { logout } = useAuth();

  const handleSOSPress = () => {
    setSOSModalVisible(true);
  };

  const handleCloseSOSModal = () => {
    setSOSModalVisible(false);
  };

  const handleAccessibilityPress = () => {
    setAccessibilityModalVisible(true);
  };

  const handleCloseAccessibilityModal = () => {
    setAccessibilityModalVisible(false);
  };

  const handleRequestHelp = async () => {
    // Aquí iría la lógica para solicitar ayuda
    
    console.log("Solicitar ayuda");
    setSOSModalVisible(false);
  };

  const handleReport = () => {
    // Aquí iría la lógica para realizar una denuncia
    console.log("Realizar denuncia");
    setSOSModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title} onPress={logout}>
          Hoy
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accessibilityButton}
            onPress={handleAccessibilityPress}
          >
            <Ionicons name="accessibility" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <SOSModal
        visible={sosModalVisible}
        onClose={handleCloseSOSModal}
        onRequestHelp={handleRequestHelp}
        onReport={handleReport}
      />

      <AccessibilityModal
        visible={accessibilityModalVisible}
        onClose={handleCloseAccessibilityModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#A9D4FB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sosButton: {
    backgroundColor: "#FF4757",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
  },
  sosText: {
    color: "white",
    fontWeight: "bold",
  },
  accessibilityButton: {
    backgroundColor: "#2196F3",
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
