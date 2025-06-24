import { View } from "../src/components/Themed"
import HomeScreen from "../src/screens/HomeScreen"

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <HomeScreen />
    </View>
  )
}
