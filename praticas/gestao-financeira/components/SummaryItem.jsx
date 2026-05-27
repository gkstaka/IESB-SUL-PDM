import { StyleSheet, Text, View } from "react-native"
import CategoryItem from "./CategoryItem"
import { globalStyles } from "../styles/globalStyles"

export default function SummaryItem({ category, value }) {
  const valueStyle = category.isIncome ? globalStyles.positiveText : globalStyles.negativeText

  const valorFormatado  = value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  let textoExibido = `-${valorFormatado}`
  if (category.isIncome) textoExibido = `+${valorFormatado}`

  const nome = category.displayName

  return (
    <View style={styles.itemContainer}>
      <CategoryItem category={category} />
      <View style={styles.textContainer}>
        <Text style={globalStyles.primaryText}>{nome}</Text>
        <Text style={valueStyle}>{textoExibido}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
  },
  textContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 12,
  },
})
