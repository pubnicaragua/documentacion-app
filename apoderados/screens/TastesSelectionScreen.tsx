import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, fetchAuthApi } from 'config/api';

interface TastesSelectionScreenProps {
  navigation: any;
}

interface TasteOption {
  id: string;
  label: string;
  icon: string;
}

const tastesOptions: TasteOption[] = [
  { id: 'salud_personal', label: 'Salud personal', icon: 'fitness-outline' },
  { id: 'dormir', label: 'Dormir', icon: 'moon-outline' },
  { id: 'comida', label: 'Comida', icon: 'restaurant-outline' },
  { id: 'escuela', label: 'Escuela', icon: 'school-outline' },
  { id: 'familia', label: 'Familia', icon: 'home-outline' },
  { id: 'amigos', label: 'Amigos', icon: 'people-outline' },
  { id: 'futbol', label: 'Futbol', icon: 'football-outline' },
  { id: 'ejercicio', label: 'Ejercicio', icon: 'barbell-outline' },
  { id: 'voleybol', label: 'Voleybol', icon: 'basketball-outline' },
  { id: 'musica', label: 'Música', icon: 'musical-note-outline' },
  { id: 'videojuegos', label: 'Videojuegos', icon: 'game-controller-outline' },
  { id: 'peliculas', label: 'Películas', icon: 'film-outline' },
];

export default function TastesSelectionScreen({ navigation }: TastesSelectionScreenProps) {
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const showToast = (type: 'success' | 'error', text1: string) => {
    console.log(text1);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.navigate('Home');
  };

  const toggleTaste = (tasteId: string) => {
    setSelectedTastes(prev => {
      const isValidId = tastesOptions.some(option => option.id === tasteId);
      
      if (!isValidId) {
        console.warn(`ID de gusto no válido: ${tasteId}`);
        return prev;
      }

      if (prev.includes(tasteId)) {
        return prev.filter(id => id !== tasteId);
      } else {
        return [...prev, tasteId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedTastes.length === 0) {
      showToast('error', 'Por favor selecciona al menos un gusto');
      return;
    }

    setIsLoading(true);

    try {
      const studentId = await AsyncStorage.getItem('studentId');
      
      if (!studentId) {
        showToast('error', 'Error: ID del estudiante no encontrado');
        return;
      }



      const response = await fetchAuthApi(API_ENDPOINTS.APODERADO_RESPONDER, {
        method: 'POST',
        body: JSON.stringify({
          alumno_id: parseInt(studentId),
          tipo_pregunta: 'gustos_generales',
          respuestas: selectedTastes,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los gustos');
      }

      showToast('success', '¡Gustos registrados exitosamente!');
      navigation.navigate('DynamicKey');

    } catch (error) {
      console.error('Error al guardar gustos:', error);
      showToast('error', 'Error de conexión. Verifica tu internet e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchExistingTastes = async () => {
      try {
        const studentId = await AsyncStorage.getItem('studentId');
       
        if (!studentId) {
          setIsFetching(false);
          return;
        }

        const response = await fetchAuthApi(
          `${API_ENDPOINTS.APODERADO_RESPUESTAS}?alumno_id=${studentId}`,
          {
            method: 'GET',
          }
        );
       setSelectedTastes(response.respuestas);
      } catch (error) {
        console.error('Error al cargar gustos existentes:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchExistingTastes();
  }, []);

  if (isFetching) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFC107" style={styles.loadingIndicator} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>¿Cuáles son los gustos de tu hijo?</Text>

        <View style={styles.tastesGrid}>
          {tastesOptions.map((taste) => (
            <TouchableOpacity
              key={taste.id}
              style={[
                styles.tasteCard,
                selectedTastes.includes(taste.id) && styles.tasteCardSelected
              ]}
              onPress={() => toggleTaste(taste.id)}
              disabled={isLoading}
            >
              <Ionicons 
                name={taste.icon as any} 
                size={32} 
                color="#fff" 
                style={styles.tasteIcon}
              />
              <Text style={styles.tasteLabel}>{taste.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton, 
              (selectedTastes.length === 0 || isLoading) && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={selectedTastes.length === 0 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#333" size="small" />
            ) : (
              <Text style={[
                styles.continueButtonText,
                selectedTastes.length === 0 && styles.continueButtonTextDisabled
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
    backgroundColor: '#334155',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 24,
    lineHeight: 30,
  },
  tastesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  tasteCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#B8860B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tasteCardSelected: {
    backgroundColor: '#DAA520',
    shadowColor: '#DAA520',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 0.98 }],
  },
  tasteIcon: {
    marginBottom: 8,
  },
  tasteLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});