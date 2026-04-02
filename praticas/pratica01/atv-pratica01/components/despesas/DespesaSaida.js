import { View } from "react-native";
import DespesaLista from "./DespesaLista";
import DespesaSumario from "./DespesaSumario";

/**
 *
 * @param {{id: string, descricao: string, valor: number, date: Date} []} dadosDespesas
 * @param {string} periodo
 * @returns
 */

export default function DespesaSaida({ dadosDespesas, periodo }) {
  return (
    <View>
      <DespesaSumario dadosDespesas={dadosDespesas} periodo={periodo} />
      <DespesaLista dadosDespesas={dadosDespesas} periodo={periodo}/>
    </View>
  );
}
