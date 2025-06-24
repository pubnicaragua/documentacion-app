<<<<<<< HEAD
// import { createStackNavigator } from "@react-navigation/stack"
// import LoginScreen from "../screens/auth/LoginScreen"
// import RegisterScreen from "../screens/auth/RegisterScreen"
// import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
// import VerificationCodeScreen from "../screens/auth/VerificationCodeScreen"
// import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen"

// const Stack = createStackNavigator()

// const AuthNavigator = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//       <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//       <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
//       <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
//     </Stack.Navigator>
//   )
// }

// export default AuthNavigator

=======
>>>>>>> c93316b (Update App AlmaIA)
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
import VerificationCodeScreen from "../screens/auth/VerificationCodeScreen"
import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen"

const Stack = createStackNavigator()

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
