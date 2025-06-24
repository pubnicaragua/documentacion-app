import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConveniosScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Convenios'); // Estado para el tab activo

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Convenios</Text>
      </View>

      {/* Contenido principal */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            No hay convenios activos en este momento.{"\n"}
            Te avisaremos cuando haya novedades.
          </Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/almis/sad-character.png")}
            style={styles.characterImage}
          />
          <Text style={styles.subtext}>
            ¡Pronto tendremos sorpresas para ti!
          </Text>
        </View>
      </ScrollView>

      {/* Tabs inferiores (idénticos al Dashboard) */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[
            styles.navItem,
            selectedTab === 'Inicio' && styles.navItemActive,
          ]}
          onPress={() => {
            setSelectedTab('Inicio');
            navigation.navigate('Dashboard');
          }}
        >
          <Ionicons
            name="home"
            size={24}
            color={selectedTab === 'Inicio' ? '#334155' : '#666'}
          />
          <Text style={[
            styles.navText,
            selectedTab === 'Inicio' && styles.navTextActive,
          ]}>
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            selectedTab === 'Convenios' && styles.navItemActive,
          ]}
          onPress={() => setSelectedTab('Convenios')}
        >
          <Ionicons
            name="cube-outline"
            size={24}
            color={selectedTab === 'Convenios' ? '#334155' : '#666'}
          />
          <Text style={[
            styles.navText,
            selectedTab === 'Convenios' && styles.navTextActive,
          ]}>
            Convenios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            selectedTab === 'Yo' && styles.navItemActive,
          ]}
          onPress={() => {
            setSelectedTab('Yo');
            navigation.navigate('UserProfile');
          }}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={selectedTab === 'Yo' ? '#334155' : '#666'}
          />
          <Text style={[
            styles.navText,
            selectedTab === 'Yo' && styles.navTextActive,
          ]}>
            Yo
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos (incluyendo los del tab inferior)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 80, // Espacio para los tabs
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterImage: {
    width: 180,
    height: 180,
    opacity: 0.8,
  },
  subtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  // Estilos para los tabs (copiados del Dashboard)
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    opacity: 0.7,
  },
  navItemActive: {
    opacity: 1,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    color: '#334155',
    fontWeight: '600',
  },
});

export default ConveniosScreen;