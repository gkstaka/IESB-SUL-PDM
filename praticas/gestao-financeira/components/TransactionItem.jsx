import { StyleSheet, Text, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import CategoryItem from "./CategoryItem"

export default function TransactionItem({ category, date, description, value }) {
  let estiloValor = globalStyles.negativeText
  if (category.isIncome) {
    estiloValor = globalStyles.positiveText
  }

  const dataFormatada = new Date(date)

  return (
    <>
      <View style={styles.itemContainer}>
        <CategoryItem category={category} />
        <View style={styles.textContainer}>
          <Text style={globalStyles.secondaryText}>
            {dataFormatada.toLocaleDateString("pt-BR")}
          </Text>
          <View style={styles.bottomLineContainer}>
            <Text style={globalStyles.primaryText}>{description}</Text>
            <Text style={estiloValor}>
              {Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).toString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={globalStyles.line} />
    </>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4
  },
  textContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    paddingVertical: 8
  },
  bottomLineContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
})
