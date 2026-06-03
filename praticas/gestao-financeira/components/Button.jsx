import { StyleSheet, Text, TouchableHighlight } from "react-native"
import { colors } from "../constants/colors"

export default function Button({ children, onPress, disabled }) {
  const desabilitado = disabled
  return (
    <TouchableHighlight
      style={[styles.background, desabilitado && styles.disabled]}
      // null no onPress bloqueia interacao quando disabled
      onPress={desabilitado ? null : onPress}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.primaryContrast,
    fontSize: 18,
    fontWeight: "600",
  },
})
