import { useContext, useMemo } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import SummaryItem from "../../components/SummaryItem"
import MonthYearPicker from "../../components/MonthYearPicker"
import PieChart from "../../components/PieChart"
import { MoneyContext } from "../../contexts/GlobalState"
import { colors } from "../../constants/colors"
import { globalStyles } from "../../styles/globalStyles"

export default function Summary() {
  const { transactions, categories, filter, setFilter } = useContext(MoneyContext)

  const { totalsById, balance, pieData } = useMemo( () => {
    const totalsById = {}
    let balance = 0

    for (const tx of transactions) {
      const catId = tx.categoryId
      totalsById[catId] = (totalsById[catId] ?? 0) + Number(tx.value)
      // renda soma, despesa subtrai do saldo
      if (tx.category.isIncome) balance += Number(tx.value)
      else balance -= Number(tx.value)
    }

    const pieData = categories
      .filter((cat) => (totalsById[cat.id] ?? 0) > 0)
      .map((cat) => ({
        value: totalsById[cat.id],
        color: cat.background,
        label: cat.displayName,
      }))

    return { totalsById, balance, pieData }
  }, [transactions, categories])


  let balanceStyle = globalStyles.negativeText
  if (balance >= 0) {
    balanceStyle = globalStyles.positiveText
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={globalStyles.screenContainer}>
      <ScrollView style={globalStyles.content}>
        <MonthYearPicker filter={filter} onChange={setFilter} />

        <View style={globalStyles.line} />

        <PieChart data={pieData} />

        <View style={globalStyles.line} />

        {categories.map( (cat) => (
          <SummaryItem key={cat.id} category={cat} value={totalsById[cat.id] ?? 0} />
        ))}

        <View style={globalStyles.line} />

        <View style={styles.balance}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={balanceStyle}>
            {balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  balance: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
})
