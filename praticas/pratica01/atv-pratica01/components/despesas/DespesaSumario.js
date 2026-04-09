import { StyleSheet, Text, View } from "react-native";

/**
 *
 * @param {{id: string, descricao: string, valor: number, date: Date} []} dadosDespesas
 * @param {string} periodo
 * @returns
 */
export default function DespesaSumario({ dadosDespesas, periodo }) {
  function getValor(despesa) {
    return despesa.valor;
  }
  const valorTotalDespesas = dadosDespesas.reduce((valorTotal, despesa) => {
    return (valorTotal = valorTotal + getValor(despesa));
  }, 0);

  return (
    <View style={styles.sumario}>
      <Text>{periodo}</Text>
      <Text>R$ {valorTotalDespesas.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sumario: {
    backgroundColor: "#aaa",
    margin: 7,
    marginBottom: 20,
    padding: 8,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
