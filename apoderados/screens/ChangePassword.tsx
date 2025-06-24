import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ChangePasswordScreenProps {
  navigation: any;
}

export default function ChangePasswordScreen({ navigation }: ChangePasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const codeInputRefs = useRef<(TextInput | null)[]>([]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);
    if (text && index < 4) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo');
      return;
    }

    setIsLoading(true);

    try {
      // Aquí simulas el envío del correo con un POST
      // Reemplaza esta línea con tu llamada real a la API
const passwordRestoreResponse = await fetch(
        "https://api-almaia.onrender.com/api/v1/auth/recuperar_password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "AlmaIA-Parent-App/1.0",
          },
          body: JSON.stringify({correo:email}),
        }
      );

      const loginData = await passwordRestoreResponse.json();

      if (!passwordRestoreResponse.ok) {
        if (passwordRestoreResponse.status === 400) {
          console.log( "Credenciales inválidas. Verifica tu correo y contraseña.");
          
        } else if (passwordRestoreResponse.status === 500) {
          console.log("Error interno del servidor. Usa el modo demo para probar la app.");
          
                  
        } else if (passwordRestoreResponse.status === 401) {
          console.log("Usuario no autorizado. Verifica tus credenciales.");
        } else {
          console.log( loginData?.message ||
              `Error ${passwordRestoreResponse.status}: ${passwordRestoreResponse.statusText}`);
        }
        return;
      }
      setEmailSent(true);
      Alert.alert('Código enviado', 'Se ha enviado un código de verificación a tu correo');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el código. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Por favor ingresa una nueva contraseña');
      return;
    }

    const code = verificationCode.join('');
    if (code.length !== 5) {
      Alert.alert('Error', 'Por favor ingresa el código de verificación completo');
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la lógica para cambiar la contraseña
const passwordChangeResponse = await fetch(
        "https://api-almaia.onrender.com/api/v1/auth/recuperar_password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "AlmaIA-Parent-App/1.0",
          },
          body: JSON.stringify({correo:email}),
        }
      );

      const loginData = await passwordChangeResponse.json();

      if (!passwordChangeResponse.ok) {
        if (passwordChangeResponse.status === 400) {
         console.error(
            "Credenciales inválidas. Verifica tu correo y contraseña."
          );
        } else if (passwordChangeResponse.status === 500) {
          console.error(
            "Error interno del servidor. Usa el modo demo para probar la app."
          );
        } else if (passwordChangeResponse.status === 401) {
          console.error("Usuario no autorizado. Verifica tus credenciales.");
        } else {
          console.error(
            loginData?.message ||
              `Error ${passwordChangeResponse.status}: ${passwordChangeResponse.statusText}`
          );
        }
        return;
      }
      Alert.alert('Éxito', 'Tu contraseña ha sido cambiada exitosamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#87CEEB" />
      <LinearGradient colors={['#334155', '#222C3BFF']} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={24} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>Cambiar contraseña</Text>

        {!emailSent ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Ingresa tu correo"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSendEmail}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Enviando...' : 'Enviar código'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa nueva contraseña"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <Text style={styles.helpText}>
              Ingresa el código enviado a tu correo para cambiar la contraseña.
            </Text>

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

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>¿No has recibido el código?</Text>
              <TouchableOpacity onPress={handleSendEmail}>
                <Text style={styles.resendLink}>Enviar de nuevo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSection}>
              <View style={styles.curvedBackground} />
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                onPress={handleSaveChanges}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Guardando...' : 'Guardar cambios'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

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
    marginBottom: 40,
  },
  headerLeft: {
    width: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  helpText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 30,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    marginHorizontal: 5,
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  resendText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 5,
  },
  resendLink: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textDecorationLine: 'underline',
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
    height: 150,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  saveButton: {
    backgroundColor: '#334155',
    marginHorizontal: 30,
    marginBottom: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#334155',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#334155',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


