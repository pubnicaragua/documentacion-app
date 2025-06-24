import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { fetchAuthApi, API_ENDPOINTS } from "config/api";
import { useAuth } from "context/AuthContext";
import { useState, useEffect } from "react";

interface WeeklyRegisterSectionProps {
  currentStreak: number;
  bestStreak: number;
}
interface WeeklyRegister {
  id: number;
  completed: boolean;
  name: string;
}

const WeeklyRegisterSection = ({
  currentStreak,
  bestStreak,
}: WeeklyRegisterSectionProps) => {
  const [days, setDays] = useState<WeeklyRegister[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    obtener_registro_semanal();
  }, []);

  function getTodayName(): string {
    const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    return dayNames[new Date().getDay()];
  }

  function getYesterdayName(): string {
    const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    return dayNames[(new Date().getDay() + 6) % 7];
  }

  async function obtener_registro_semanal() {
    const data = await fetchAuthApi(
      API_ENDPOINTS.REGISTRO_SEMANAL + "?alumno_id=" + user?.alumno_id,
      {
        method: "GET",
      }
    );

    // Orden deseado
    const order = ["Dom", "Lun", "Mar", "Mie", "Jue", "Ayer", "Hoy"];
    const sorted = order
      .map((dayName) => data.find((d: WeeklyRegister) => d.name === dayName))
      .filter(Boolean); // elimina los undefined si falta alguno

    setDays(sorted);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Registro semanal</Text>

      <View style={styles.weekContainer}>
        <View style={styles.daysContainer}>
          {days.map((day) => {
            const isToday = day.name === getTodayName();
            const isYesterday = day.name === getYesterdayName();

            return (
              <View key={day.id} style={styles.dayItem}>
                <View
                  style={[
                    styles.dayCircle,
                    day.completed && styles.completedDay,
                    isToday && styles.todayCircle,
                    isYesterday && styles.yesterdayCircle,
                  ]}
                >
                  {day.completed && (
                    <Ionicons name="checkmark" size={24} color="white" />
                  )}
                </View>
                <Text style={styles.dayText}>{day.name}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.divider} />

        <View style={styles.streaksContainer}>
          <View style={styles.streakItem}>
            <Text style={styles.streakText}>Mi racha actual</Text>
            <View style={styles.streakValue}>
              <Ionicons name="flame" size={20} color="#FF9800" />
              <Text style={styles.streakNumber}>x{currentStreak}</Text>
            </View>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakItem}>
            <Text style={[styles.streakText, { marginLeft: 5 }]}>
              Mi mejor racha
            </Text>
            <View style={styles.streakValue}>
              <Ionicons name="flame" size={20} color="#FF9800" />
              <Text style={styles.streakNumber}>x{bestStreak}</Text>
            </View>
          </View>
        </View>
      </View>
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
  weekContainer: {
    backgroundColor: colors.primaryBlueMiddles,
    borderRadius: 15,
    padding: 15,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dayItem: {
    alignItems: "center",
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  completedDay: {
    backgroundColor: colors.primaryBlueStrong,
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  yesterdayCircle: {
    borderWidth: 2,
    borderColor: "#90CAF9",
  },
  dayText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "white",
    marginVertical: 10,
  },
  streaksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  streakItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    color: "white",
    marginRight: 8,
  },
  streakValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakNumber: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  streakDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "white",
  },
});

export default WeeklyRegisterSection;
