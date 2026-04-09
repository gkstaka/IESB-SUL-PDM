import { StyleSheet, Text, View } from "react-native";
import DespesaSaida from "../components/despesas/DespesaSaida";

/**
 *
 * @param {{ dadosDespesas: {id: string, descricao: string, valor:number, data: Date} []}} dadosDespesas
 * @returns
 */
export default function DespesasRecentes({ dadosDespesas }) {
  //   const

  /**
   *
   * @param { {id: string, descricao: string, valor:number, data: Date} []} dadosDespesas
   * @returns
   */
  function filtraSeteDias(dadosDespesas) {
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);

    const despesasFiltrato = dadosDespesas.filter((despesa) => {
      return despesa.data >= seteDiasAtras && despesa.data <= hoje;
    });
    return despesasFiltrato;
  }

  return (
    <View style={styles.view}>
      <DespesaSaida dadosDespesas={filtraSeteDias(dadosDespesas)} periodo="Últimos sete dias" />
    </View>
  );
}

const styles = StyleSheet.create({
  view: { backgroundColor: "#fff" , flex:1},
});