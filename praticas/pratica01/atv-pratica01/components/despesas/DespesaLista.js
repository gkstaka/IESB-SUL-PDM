import { FlatList, Text, View } from "react-native";
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
  function renderDespesa({ item }) {
    const descricao = item.descricao;
    const valor = item.valor;
    const data = item.data;
    return <DespesaItem descricao={descricao} valor={valor} data={data}/>;
  }

  return (
    <View>
      <FlatList
        data={dadosDespesas}
        keyExtractor={(despesa) => despesa.id}
        renderItem={renderDespesa}
        
      ></FlatList>
    </View>
  );
}
