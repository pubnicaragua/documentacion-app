import { StyleSheet, View, Text, Image, TouchableOpacity, type ImageSourcePropType } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SvgXml } from "react-native-svg"
import { backgroundHomesvg } from "@/indexsvfg"

interface ProfileHeaderProps {
  name: string
  profileImage: ImageSourcePropType
  onSOSPress: () => void
  onAccesPress: () => void
}

const ProfileHeader = ({ name, profileImage, onSOSPress , onAccesPress }: ProfileHeaderProps) => {
  return (
    <View style={{ flex: 1 }}>
      <SvgXml xml={backgroundHomesvg} width="100%" style={[styles.fixedBackground]} />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image source={profileImage} style={styles.profileImage} />
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.sosButton} onPress={onSOSPress}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accessibilityButton} onPress={onAccesPress}>
            <Ionicons name="accessibility" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    // marginTop: 10,
  },
  fixedBackground: {
    transform: [{ scaleY: .3 }],
    position: 'absolute',
    top: -120,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 35,
    marginRight: 7,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  sosButton: {
    backgroundColor: "#FF4757",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 8,
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
})

export default ProfileHeader
