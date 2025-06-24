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

interface TestCompletionScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

export default function TestCompletionScreen({ navigation }: TestCompletionScreenProps) {
  const handleBack = () => {
    // Bloquear navegación hacia atrás según recomendaciones UX
    // navigation.goBack();
  };

  const handleClose = () => {
    // Funcionalidad para cerrar si es necesaria
    navigation.navigate('Dashboard');
  };

  const handleFinish = () => {
    // Navegar al Dashboard principal del apoderado
    navigation.navigate('Dashboard');
  };

  const renderConfetti = () => {
    const confettiPieces = [
      { color: '#FF6B6B', left: '15%', top: '25%', rotation: '15deg', delay: 0 },
      { color: '#4ECDC4', left: '25%', top: '20%', rotation: '-20deg', delay: 100 },
      { color: '#45B7D1', left: '35%', top: '30%', rotation: '45deg', delay: 200 },
      { color: '#96CEB4', left: '65%', top: '25%', rotation: '-30deg', delay: 300 },
      { color: '#FFEAA7', left: '75%', top: '20%', rotation: '60deg', delay: 400 },
      { color: '#DDA0DD', left: '85%', top: '35%', rotation: '-45deg', delay: 500 },
      { color: '#98D8C8', left: '20%', top: '45%', rotation: '30deg', delay: 600 },
      { color: '#F7DC6F', left: '80%', top: '50%', rotation: '-60deg', delay: 700 },
      { color: '#BB8FCE', left: '10%', top: '40%', rotation: '90deg', delay: 800 },
      { color: '#85C1E9', left: '90%', top: '40%', rotation: '-90deg', delay: 900 },
    ];

    return (
      <>
        {confettiPieces.map((piece, index) => (
          <View
            key={index}
            style={[
              styles.confettiPiece,
              {
                backgroundColor: piece.color,
                left: piece.left,
                top: piece.top,
                transform: [{ rotate: piece.rotation }],
              },
            ]}
          />
        ))}
      </>
    );
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

        {/* Barra de progreso al 100% */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar} />
        </View>

        {/* Confeti animado */}
        {renderConfetti()}

        {/* Bocadillo de diálogo */}
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            <Text style={styles.speechBold}>Conoces</Text> un <Text style={styles.speechBold}>100%</Text>{'\n'}
            a tu <Text style={styles.speechBold}>hijo.</Text>
          </Text>
          <View style={styles.speechTail} />
        </View>

        {/* Personaje Almie celebrando */}
        <View style={styles.almieContainer}>
          {/* Gorro de fiesta */}
          <View style={styles.partyHat} />
          <View style={styles.partyHatStripes} />
          
          <View style={styles.almie}>
            {/* Ojos felices */}
            <View style={styles.eyes}>
              <View style={styles.eye} />
              <View style={styles.eye} />
            </View>
            {/* Sonrisa grande */}
            <View style={styles.bigSmile} />
          </View>
          
          {/* Brazos levantados celebrando */}
          <View style={styles.leftArmCelebrating} />
          <View style={styles.rightArmCelebrating} />
          
          {/* Manos celebrando */}
          <View style={styles.leftHand}>
            <Text style={styles.celebrateEmoji}>🎉</Text>
          </View>
          <View style={styles.rightHand}>
            <Text style={styles.celebrateEmoji}>🎊</Text>
          </View>
          
          {/* Pies */}
          <View style={styles.feet}>
            <View style={styles.foot} />
            <View style={styles.foot} />
          </View>
        </View>
      </View>

      {/* Área blanca inferior */}
      <View style={styles.bottomArea}>
        <Text style={styles.motivationalText}>
          ¡Tus respuestas ayudarán a personalizar su experiencia en AlmaIA!
        </Text>
        
        {/* Botón Finalizar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
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
    height: height * 0.7,
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
  progressContainer: {
    position: 'absolute',
    top: 80,
    left: 24,
    right: 24,
    zIndex: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FFC107', // Color dorado para mostrar 100% completo
    borderRadius: 4,
    width: '100%', // Progreso completo al 100%
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 12,
    borderRadius: 2,
    zIndex: 1,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
    maxWidth: width * 0.75,
  },
  speechText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  speechBold: {
    fontWeight: 'bold',
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
  partyHat: {
    position: 'absolute',
    top: -15,
    width: 30,
    height: 25,
    backgroundColor: '#FFC107',
    borderRadius: 15,
    transform: [{ rotate: '10deg' }],
    zIndex: 2,
  },
  partyHatStripes: {
    position: 'absolute',
    top: -12,
    width: 28,
    height: 3,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
    transform: [{ rotate: '10deg' }],
    zIndex: 3,
  },
  almie: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    marginBottom: 4,
  },
  eye: {
    width: 10,
    height: 15,
    backgroundColor: '#000',
    borderRadius: 5,
    marginHorizontal: 3,
  },
  bigSmile: {
    width: 22,
    height: 11,
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    borderRadius: 11,
  },
  leftArmCelebrating: {
    position: 'absolute',
    left: -15,
    top: 10,
    width: 2,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 1,
    transform: [{ rotate: '-60deg' }], // Brazo levantado celebrando
  },
  rightArmCelebrating: {
    position: 'absolute',
    right: -15,
    top: 10,
    width: 2,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 1,
    transform: [{ rotate: '60deg' }], // Brazo levantado celebrando
  },
  leftHand: {
    position: 'absolute',
    left: -25,
    top: 0,
    zIndex: 2,
  },
  rightHand: {
    position: 'absolute',
    right: -25,
    top: 0,
    zIndex: 2,
  },
  celebrateEmoji: {
    fontSize: 16,
  },
  feet: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -12,
    justifyContent: 'center',
  },
  foot: {
    width: 10,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 4,
    marginHorizontal: 1,
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 40,
  },
  motivationalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  finishButton: {
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
  finishButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});