import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { backgroundHomesvg, chatfeelsvg, registerButtonsvg } from "@/indexsvfg";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { useAuth } from "context/AuthContext";
import { agruparPorPregunta, siguientePregunta } from "service/MotorPreguntasService";
import { pantallaPregunta } from "data/PantallaPreguntas";

const MascotGreeting = () => {
  const navigation = useNavigation<any>();
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const { user } = useAuth();

  const handleTaskRegistration = async () => {

    const preguntas = await fetchAuthApi(
      API_ENDPOINTS.ALUMNOS_RESPUESTAS + "?alumno_id=" + user?.alumno_id,
      { method: "GET" }
    );
    console.log(preguntas);
    
    const preguntasAlumno = agruparPorPregunta(preguntas);
    siguientePregunta(navigation,pantallaPregunta[preguntasAlumno[0]?.template_code],preguntasAlumno,0)
  };

  useEffect(() => {
    const animateHand = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotationAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotationAnim, {
            toValue: -1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotationAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateHand();
  }, []);

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-20deg", "0deg", "20deg"],
  });

  return (
    <View style={styles.containerBg}>
      <SvgXml xml={backgroundHomesvg} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <View style={styles.contImgButt}>
          <SvgXml xml={chatfeelsvg} style={styles.chatFeelSvg} />
          <TouchableOpacity
            onPress={handleTaskRegistration}
            style={styles.registerButtonSvg}
          >
            <SvgXml
              xml={registerButtonsvg}
              style={{ width: "100%", height: "100%" }}
            />
          </TouchableOpacity>
          <Animated.Image
            source={require("../../assets/home/animated-hand.png")}
            style={[
              styles.handImage,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerBg: {
    flex: 1,
    zIndex: -100,
    position: "relative",
    marginBottom: 10,
  },
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  contImgButt: {
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  handImage: {
    position: "absolute",
    height: 50,
    width: 50,
    bottom: 50,
    right: 75,
    resizeMode: "contain",
  },
  chatFeelSvg: {
    width: "120%",
    height: 180,
    marginBottom: 20,
    alignSelf: "center",
    transform: [{ scale: 1.2 }],
  },
  registerButtonSvg: {
    width: "100%",
    height: 95,
    alignSelf: "center",
    marginLeft: 120,
    resizeMode: "contain",
    transform: [{ scale: 1.2 }],
  },
});

export default MascotGreeting;
