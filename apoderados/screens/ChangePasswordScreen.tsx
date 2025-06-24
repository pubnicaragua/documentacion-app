import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchAuthApi, API_ENDPOINTS } from 'config/api';
import colors from 'constants/colors';
import { useAuth } from 'context/AuthContext';

const ChangePasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [canResend, setCanResend] = useState(true);
    const { user } = useAuth()
  
  // Referencias para los inputs del código de verificación
  const codeInputRefs = useRef([]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSaveChanges = async () => {
    if (newPassword.trim().length !== 0) {
      const code = verificationCode.join('');  // 'abcd'

       await fetchAuthApi(API_ENDPOINTS.UPDATE_PASSWORD, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newPassword: newPassword,
              userId:user?.id,
              verificationCode:code
            }),
          });
      Alert.alert('Error', 'Por favor ingresa una nueva contraseña');
      return;
    }
    
    const code = verificationCode.join('');
    if (code.length !== 5) {
      Alert.alert('Error', 'Por favor ingresa el código de verificación completo');
      return;
    }
    
    // Aquí puedes agregar la lógica para cambiar la contraseña
    Alert.alert('Éxito', 'Contraseña cambiada correctamente');
  };

  const handleCodeChange = (text, index) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);

    // Auto-focus al siguiente input si se ingresó un dígito
    if (text && index < 4) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (key, index) => {
    // Si se presiona backspace y el campo está vacío, ir al anterior
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    
    Alert.alert('Código enviado', 'Se ha enviado un nuevo código de verificación');
    setCanResend(false);
    
    // Simular tiempo de espera para reenvío
    setTimeout(() => {
      setCanResend(true);
    }, 30000); // 30 segundos
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#87CEEB" />
      
      <LinearGradient
        colors={['#87CEEB', '#B0E0E6', '#E0F6FF']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Chat Icon */}
        <View style={styles.chatIconContainer}>
          <View style={styles.chatIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={32} color="#fff" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Cambiar contraseña</Text>

        {/* Password Input */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ingresar nueva contraseña"
              placeholderTextColor="rgba(255, 255, 255, 0.8)"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          {/* Verification Message */}
          <Text style={styles.verificationMessage}>
            Hemos enviado una clave enviada al teléfono de tu madre para poder cambiar la contraseña
          </Text>

          {/* Verification Code Inputs */}
          <View style={styles.codeContainer}>
            {verificationCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (codeInputRefs.current[index] = ref)}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleCodeKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No has recibido el código de verificación?</Text>
            <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
              <Text style={[styles.resendLink, !canResend && styles.resendDisabled]}>
                Enviar de nuevo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Curved Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.curvedBackground} />
          
          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          </TouchableOpacity>
          
          {/* Bottom Indicator */}
          <View style={styles.bottomIndicator} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    width: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatIconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chatIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  input: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  verificationMessage: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
    opacity: 0.9,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
  resendLink: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    opacity: 0.5,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  curvedBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 18,
    marginHorizontal: 30,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default ChangePasswordScreen;