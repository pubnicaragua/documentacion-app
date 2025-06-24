import { StyleSheet, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ActivityIconProps {
  name: string
  selected: boolean
}

const ActivityIcon = ({ name, selected }: ActivityIconProps) => {
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={name} size={32} color="white" />
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
})

export default ActivityIcon
