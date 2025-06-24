import { StyleSheet, Image, View } from "react-native"

const MascotImage = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.image} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
})

export default MascotImage
