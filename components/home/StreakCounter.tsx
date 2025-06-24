import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import { fetchAuthApi, API_ENDPOINTS } from "config/api";

const StreakCounter = () => {
      const { user } = useAuth()
  const [racha, setRacha] = useState({"mejor_racha_semanal": 0, "total_respuestas_correctas": 0});
  
   useEffect(() => {
      obtener_racha();
      console.log("TasksScreen mounted");
      return () => {
        console.log("TasksScreen unmounted");
      };
    }, []);
      async function obtener_racha(){
    const racha = await fetchAuthApi(API_ENDPOINTS.RACHA+"?alumno_id="+user?.alumno_id, {
            method: "GET",
          });
          setRacha(racha)
          console.log(racha);
          
      }
  return (
    <>
      <View style={styles.line} />
      <View style={styles.container}>

        <View style={styles.streakItem}>
          <Text style={styles.streakText}>Mi racha actual</Text>
          <View style={styles.streakValue}>
            <Ionicons name="flame" size={20} color="#FF9800" />
            <Text style={styles.streakNumber}>x{racha.total_respuestas_correctas}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.streakItem}>
          <Text style={styles.streakText}>Mi mejor racha</Text>
          <View style={styles.streakValue}>
            <Ionicons name="flame" size={20} color="#FF9800" />
            <Text style={styles.streakNumber}>x{racha.mejor_racha_semanal}</Text>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  line: {
    height: .5,
    backgroundColor: "white",
    width: "100%"
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 5,
  },
  streakItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    color: "white",
    marginRight: 3,
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
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "white",
  },
})

export default StreakCounter
