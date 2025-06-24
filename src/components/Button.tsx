import { StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

interface ButtonProps extends TouchableOpacityProps {
  title: string
}

export const Button = ({ title, disabled, ...rest }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, disabled && styles.buttonDisabled]} disabled={disabled} {...rest}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})
