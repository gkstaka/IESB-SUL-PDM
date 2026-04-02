import { ScrollView, StyleSheet, Text, View } from "react-native"; // Added StyleSheet
import DespesaItem from "./DespesaItem";

/**
 *
 * @param {{id: string, descricao: string, valor: number, date: Date} []} dadosDespesas
 * @param {string} periodo
 * @returns
 */
export default function DespesaLista({ dadosDespesas, periodo }) {
  /**
   *
   * @param {item: {id:string, descricao: string, valor: number, data: Date}} item
   */
  return (
    <View style={styles.container}>
      <ScrollView> 
        {dadosDespesas.map((item) => (
          <DespesaItem
            key={item.id}
            descricao={item.descricao}
            valor={item.valor}
            data={item.data}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
