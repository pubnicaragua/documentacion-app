"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"
import { ProfileProvider } from "./context/ProfileContext"

// Autenticación
import LoginScreen from "./screens/auth/LoginScreen"
import RegisterScreen from "./screens/auth/RegisterScreen"
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen"
import VerificationCodeScreen from "./screens/auth/VerificationCodeScreen"
import CompleteProfileScreen from "./screens/auth/CompleteProfileScreen"

// Principal
import HomeScreen from "./screens/HomeScreen"
import ProfileScreen from "./screens/ProfileScreen"
import TasksScreen from "./screens/TasksScreen"

// Estado de ánimo
import MoodSelectionScreen from "./screens/MoodSelectionScreen"
import EmotionDetailScreen from "./screens/EmotionDetailScreen"
import GoodDayFactorsScreen from "./screens/GoodDayFactorsScreen"
import DiaryEntryScreen from "./screens/DiaryEntryScreen"
import ThankYouScreen from "./screens/ThankYouScreen"

// SOS
import SOSHelpScreen from "./screens/SOSHelpScreen"
import SOSReportScreen from "./screens/SOSReportScreen"

// Tareas y perfil
import TaskRegistrationScreen from "./screens/TaskRegistrationScreen"
import EditProfileScreen from "./screens/EditProfileScreen"
import ChangePasswordScreen from "./screens/ChangePasswordScreen"
import QuestionScreeen from "./screens/QuestionScreeen"
import FreeTextQuestionScreen from "./screens/FreeTextQuestionScreen"
import DashboardScreen from "apoderados/screens/DashboardScreen"
import StudentProfileScreen from "apoderados/screens/StudentProfileScreen"
import EditProfileApoderadoScreen from "apoderados/screens/EditProfileScreen"
import IntroTastesScreen from "apoderados/screens/IntroTastesScreen"
import ConsentScreen from "apoderados/screens/ConsentScreen"
import TastesSelectionScreen from "apoderados/screens/TastesSelectionScreen"
import DynamicKeyScreen from "apoderados/screens/DynamicKeyScreen"
import PersonalizedQuestionScreen from "apoderados/screens/PersonalizedQuestionScreen"
import StoryTypesQuestionScreen from "apoderados/screens/StoryTypesQuestionScreen"
import TestCompletionScreen from "apoderados/screens/TestCompletionScreen"
import UserProfileScreen from "apoderados/screens/UserProfileScreen"
import ListadoAlumnosScreeen from "apoderados/screens/ListadoAlumnosScreeen"
import CompleteProfileApoderadoScreen from "apoderados/screens/CompleteProfileScreen"
import SOSScreen from "apoderados/screens/SOSScreen"
import LoginApoderadoScreen from "apoderados/screens/LoginApoderadoScreen"
import ConveniosScreen from "apoderados/screens/ConveniosScreeen"

// Apoderado

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = ""

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline"
        } else if (route.name === "Tasks") {
          iconName = focused ? "list" : "list-outline"
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline"
        }

        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "#4A80F0",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
    <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: "Tareas" }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
  </Tab.Navigator>
)

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="LoginApoderado" component={LoginApoderadoScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
    <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
  </Stack.Navigator>
)

const AlumnoNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={TabNavigator} />
    <Stack.Screen name="MoodSelection" component={MoodSelectionScreen} />
    <Stack.Screen name="EmotionDetail" component={EmotionDetailScreen} />
    <Stack.Screen name="GoodDayFactors" component={GoodDayFactorsScreen} />
    <Stack.Screen name="Question" component={QuestionScreeen} />
    <Stack.Screen name="FreeTextQuestion" component={FreeTextQuestionScreen} />
    <Stack.Screen name="DiaryEntry" component={DiaryEntryScreen} />
    <Stack.Screen name="ThankYou" component={ThankYouScreen} />
    <Stack.Screen name="SOSHelp" component={SOSHelpScreen} />
    <Stack.Screen name="SOSReport" component={SOSReportScreen} />
    <Stack.Screen name="TaskRegistration" component={TaskRegistrationScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </Stack.Navigator>
)

const ApoderadoNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
    <Stack.Screen name="CompleteProfileApoderado" component={CompleteProfileApoderadoScreen} />
    <Stack.Screen name="EditProfileApoderado" component={EditProfileApoderadoScreen} />
    <Stack.Screen name="IntroTastes" component={IntroTastesScreen} />
    <Stack.Screen name="Consent" component={ConsentScreen} />
    <Stack.Screen name="TastesSelection" component={TastesSelectionScreen} />
    <Stack.Screen name="DynamicKey" component={DynamicKeyScreen} />
    <Stack.Screen name="PersonalizedQuestion" component={PersonalizedQuestionScreen} />
    <Stack.Screen name="StoryTypesQuestion" component={StoryTypesQuestionScreen} />
    <Stack.Screen name="TestCompletion" component={TestCompletionScreen} />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    <Stack.Screen name="Convenio" component={ConveniosScreen} />
    <Stack.Screen name="ListadoEstudiantes" component={ListadoAlumnosScreeen} />
    <Stack.Screen name="SOS" component={SOSScreen} />
  </Stack.Navigator>
)

const RootNavigator = () => {
  const { user } = useAuth()

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          user.apoderado_id > 0 ? (
            <Stack.Screen name="ApoderadoFlow" component={ApoderadoNavigator} />
          ) : (
            <Stack.Screen name="AlumnoFlow" component={AlumnoNavigator} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProfileProvider>
          <RootNavigator />
        </ProfileProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
