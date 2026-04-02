import { StyleSheet, Text, View } from "react-native";

/**
 *
 * @param {{descricao: string, valor: number, data:Date}} despesa
 * @returns
 */
export default function DespesaItem({ descricao, valor, data }) {
  /**
   *
   * @param {Date} data
   * @returns
   */
  function getDataFormatada(data) {
    return (
      data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear()
    );
  }

  return (
    <View style={styles.despesa}>
      <Text style={styles.data}>{getDataFormatada(data)}</Text>
      <Text style={styles.descricao}>{descricao}</Text>
      <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  despesa: {
    backgroundColor: "#ccc",
    margin: 7,
    padding: 8,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  campos: {
    padding: 1,
  },
  data:{
    textAlign:'left',
    flex:2
  },
  descricao:{
    textAlign:'left',
    flex:6
  },
  valor:{
    textAlign:'right',
    flex:2
  }
});
