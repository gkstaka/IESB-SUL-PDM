import { StyleSheet,  View } from "react-native";
import DespesaSaida from "../components/despesas/DespesaSaida";

/**
 *
 * @param {{ dadosDespesas: {id: string, descricao: string, valor:number, data: Date} []}} param0
 * @returns
 */
export default function TodasDespesas({ dadosDespesas }) {
  return (
    <View style={styles.view}>
      <DespesaSaida dadosDespesas={dadosDespesas} periodo={"Todos"} />
    </View>
  );
}

const styles = StyleSheet.create({
  view: { backgroundColor: "#fff" , flex:1},
});
