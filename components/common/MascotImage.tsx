import { StyleSheet, Image, View } from "react-native"
import { SvgXml } from "react-native-svg"
import { howfeelalmi } from "@/indexsvfg"

const MascotImage = () => {
  return (
    <View style={styles.container}>
      <SvgXml xml={howfeelalmi} width={160} height={160} style={{transform: [{ scale: 1.2 }]}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
})

export default MascotImage
