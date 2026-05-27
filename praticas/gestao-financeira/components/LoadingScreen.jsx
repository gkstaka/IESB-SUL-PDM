import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { colors } from "../constants/colors"

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão Financeira</Text>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",

    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
})
