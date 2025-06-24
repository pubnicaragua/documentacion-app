import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

interface IntroTastesScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

export default function IntroTastesScreen({ navigation }: IntroTastesScreenProps) {
  const handleBack = () => {
    // Bloquear navegación hacia atrás según recomendación UX
    // navigation.goBack();
  };

  const handleClose = () => {
    // Funcionalidad para cerrar (si es necesaria)
  };  const handleContinue = () => {
    // Navegar a la siguiente pantalla (Gustos del menor)
    navigation.navigate('TastesSelection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header con gradiente y controles */}
      <View style={styles.header}>
        <View style={styles.gradientBackground} />
        
        {/* Botones de navegación */}
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#334155" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Bocadillo de diálogo */}
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            Vamos a responder unas cuantas preguntas sobre los gustos de tu hijo.
          </Text>
          <View style={styles.speechTail} />
        </View>

        {/* Personaje Almie */}
        <View style={styles.almieContainer}>
          <View style={styles.almie}>
            {/* Ojos */}
            <View style={styles.eyes}>
              <View style={styles.eye} />
              <View style={styles.eye} />
            </View>
            {/* Sonrisa */}
            <View style={styles.smile} />
          </View>
          
          {/* Brazos */}
          <View style={styles.leftArm} />
          <View style={styles.rightArm} />
          
          {/* Pies */}
          <View style={styles.feet}>
            <View style={styles.foot} />
            <View style={styles.foot} />
          </View>
        </View>
      </View>

      {/* Contenido informativo */}
      <View style={styles.content}>
        <Text style={styles.paragraph}>
          Ayúdanos a conocer mejor a tu hijo respondiendo unas preguntas sencillas sobre sus gustos.
        </Text>
        
        <Text style={styles.paragraph}>
          Esto nos permitirá personalizar su experiencia en AlmaIA.
        </Text>
      </View>

      {/* Botón Continuar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: height * 0.65,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '85%',
    backgroundColor: '#334155', // Color azul oscuro
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerControls: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
    maxWidth: width * 0.85,
  },
  speechText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  speechTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
  },
  almieContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  almie: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1,
  },
  eyes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  eye: {
    width: 12,
    height: 18,
    backgroundColor: '#000',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  smile: {
    width: 20,
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderRadius: 10,
  },
  leftArm: {
    position: 'absolute',
    left: -15,
    top: 20,
    width: 3,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 2,
    transform: [{ rotate: '-30deg' }],
  },
  rightArm: {
    position: 'absolute',
    right: -15,
    top: 20,
    width: 3,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 2,
    transform: [{ rotate: '30deg' }],
  },
  feet: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -15,
    justifyContent: 'center',
  },
  foot: {
    width: 12,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
    justifyContent: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#FFC107',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});