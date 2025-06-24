import { StyleSheet, View, Text, ScrollView } from "react-native"
import { SvgXml } from "react-native-svg"
import { cupsvg } from "@/indexsvfg"
import colors from "../../constants/colors"

const AchievementsSection = () => {
  const achievements = [
    {
      id: 1,
      title: "Hiciste un registro",
    },
    {
      id: 2,
      title: "Registraste una tarea",
    },
    {
      id: 3,
      title: "Respondiste una pregunta",
    },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Logros</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <SvgXml xml={cupsvg} height={70} width={70} />
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  achievementCard: {
    display: "flex",
    backgroundColor: colors.primaryBlueMiddles,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginRight: 15,
    width: 120,
    height: 150,
    justifyContent: "space-between",
  },
  achievementIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  achievementTitle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default AchievementsSection
