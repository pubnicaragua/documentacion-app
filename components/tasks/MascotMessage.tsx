import { StyleSheet, View, Text, Animated, Easing, Image } from "react-native";
import { almiefittneshandsvg } from "@/indexsvfg";
import { SvgXml } from "react-native-svg";
import { useEffect, useRef } from "react";

interface MascotMessageProps {
  message: string;
  points: number;
}

const MascotMessage = ({ message, points }: MascotMessageProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateHand = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
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

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-15deg", "15deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        
        <View style={styles.mascotContainer}>
          {/* Reemplazo del SVG por una imagen */}
          <Image
            source={require('./assets/almiefitnes.png')} // Ajusta la ruta según tu estructura
            style={styles.mascotImage}
            resizeMode="contain"
          />
          
          <Animated.View style={[
            styles.handContainer, 
            { transform: [{ rotate: rotateInterpolate }] }
          ]}>
            <SvgXml 
              xml={almiefittneshandsvg} 
              style={styles.handSvg} 
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
    position: "relative",
  },
  messageContainer: {
    alignItems: "center",
    position: "relative",
  },
  messageBubble: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    width: "100%",
  },
  messageText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  mascotContainer: {
    position: "relative",
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  handContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
  },
  handSvg: {
    width: "100%",
    height: "100%",
  }
});

export default MascotMessage;