import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SvgXml } from "react-native-svg";
import { cupsvg } from "@/indexsvfg";
import colors from "../../constants/colors";
import { useEffect, useState } from "react";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { useAuth } from "context/AuthContext";

interface Achievement {
  id: number;
  title: string;
  key: string;
}

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    obtener_logros();
  }, []);

  const achievements_category = [
    {
      id: 1,
      title: "Registro diario",
      key: "registro_diario_hoy",
    },
    {
      id: 2,
      title: "Registro semanal",
      key: "registro_semana",
    },
    {
      id: 3,
      title: "Registro mensual",
      key: "registro_mes",
    },
    {
      id: 4,
      title: "Registraste una tarea hoy",
      key: "registro_tarea_hoy",
    },
    {
      id: 5,
      title: "Respondiste preguntas hoy",
      key: "registro_respuestas_hoy",
    },
  ];

  async function obtener_logros() {
    try {
      const logros = await fetchAuthApi(
        API_ENDPOINTS.LOGROS + "?alumno_id=" + user?.alumno_id,
        {
          method: "GET",
        }
      );
      
      const earnedAchievements = achievements_category.filter(
        (a) => logros[a.key] === true
      );
      setAchievements(earnedAchievements);
    } catch (error) {
      console.error("Error al obtener logros:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Logros</Text>

      {achievements.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <SvgXml xml={cupsvg} height={70} width={70} />
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noAchievementsText}>Aún no has obtenido logros</Text>
      )}
    </View>
  );
};

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
  noAchievementsText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
});

export default AchievementsSection;