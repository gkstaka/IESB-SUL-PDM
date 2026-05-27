import { MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import { colors } from "../constants/colors"

export default function CategoryItem({ category }) {
  const corFundo = category.background
  return (
    <View style={[styles.background, { backgroundColor: corFundo }]}>
      <MaterialIcons name={category.icon} size={24} color={colors.primaryContrast} />
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 22
  }
})
