import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StoryTypesQuestionScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const storyOptions = [
  'Aventuras y acción',
  'Magia y fantasía',
  'Misterio y ciencia ficción',
  'Historias reales o cotidianas',
];

export default function StoryTypesQuestionScreen({ navigation }: StoryTypesQuestionScreenProps) {
  const [selectedStoryType, setSelectedStoryType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    // Funcionalidad para cerrar si es necesaria
    navigation.navigate('Dashboard');
  };

  const selectStoryType = (storyType: string) => {
    setSelectedStoryType(storyType);
  };

  const handleContinue = async () => {
    if (!selectedStoryType) {
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      const studentId = await AsyncStorage.getItem('studentId');
      
      if (!token) {
        navigation.navigate('Home');
        return;
      }

      if (!studentId) {
        return;
      }      const response = await fetch('https://api-almaia.onrender.com/api/v1/preguntas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          alumno_id: parseInt(studentId),
          tipo_pregunta: 'tipo_historia',
          respuesta: selectedStoryType,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 400) {

console.log('Datos inválidos. Revisa la información enviada.');

        } else if (response.status === 401) {

          navigation.navigate('Home');
          return;
        } else if (response.status === 500) {
        console.log('Error del servidor. Intenta más tarde.');
        
        } else {
        console.log(responseData.message || 'Error al guardar la respuesta');
        }
        return;
      }

      navigation.navigate('TestCompletion');

    } catch (error) {
      console.error('Error al guardar respuesta:', error);
     
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
          </View>

          {/* Bocadillo de diálogo */}
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              <Text style={styles.speechBold}>¿Qué tipo de{'\n'}historias</Text> le{'\n'}gustan más?
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
            
            {/* Mano derecha saludando */}
            <View style={styles.rightHand}>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
            
            {/* Pies */}
            <View style={styles.feet}>
              <View style={styles.foot} />
              <View style={styles.foot} />
            </View>
          </View>
        </View>

        {/* Opciones de tipos de historias */}
        <View style={styles.optionsContainer}>
          {storyOptions.map((storyType, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedStoryType === storyType && styles.optionButtonSelected
              ]}
              onPress={() => selectStoryType(storyType)}
              disabled={isLoading}
            >
              <Text style={[
                styles.optionText,
                selectedStoryType === storyType && styles.optionTextSelected
              ]}>
                {storyType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón Continuar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton, 
              (!selectedStoryType || isLoading) && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedStoryType || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#333" size="small" />
            ) : (
              <Text style={[
                styles.continueButtonText,
                !selectedStoryType && styles.continueButtonTextDisabled
              ]}>
                Continuar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: height * 0.55,
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
    backgroundColor: '#FFC107', // Color dorado para mostrar progreso casi completo
    borderRadius: 4,
    width: '95%', // Progreso casi al 100%
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
    marginBottom: 6,
  },
  eye: {
    width: 10,
    height: 15,
    backgroundColor: '#000',
    borderRadius: 5,
    marginHorizontal: 3,
  },
  smile: {
    width: 18,
    height: 9,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderRadius: 9,
  },
  leftArm: {
    position: 'absolute',
    left: -12,
    top: 18,
    width: 2,
    height: 22,
    backgroundColor: '#000',
    borderRadius: 1,
    transform: [{ rotate: '-30deg' }],
  },
  rightArm: {
    position: 'absolute',
    right: -12,
    top: 18,
    width: 2,
    height: 22,
    backgroundColor: '#000',
    borderRadius: 1,
    transform: [{ rotate: '30deg' }],
  },
  rightHand: {
    position: 'absolute',
    right: -22,
    top: 15,
  },
  waveEmoji: {
    fontSize: 14,
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
  optionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(100, 116, 139, 0.8)', // Color gris azulado como en el diseño
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(100, 116, 139, 1)',
    borderColor: '#FFC107',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
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
  continueButtonDisabled: {
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: 'rgba(51, 51, 51, 0.5)',
  },
});