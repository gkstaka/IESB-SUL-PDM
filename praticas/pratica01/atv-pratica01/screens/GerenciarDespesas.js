import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function GerenciarDespesas({ adicionarDespesa }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date());

  function dataAlterada (event, selectedDate) {
    if (selectedDate) {
      setData(selectedDate);
    }
  };

  function mostrarCalendario() {
    DateTimePickerAndroid.open({
      value: data,
      dataAlterada,
      mode: "date",
      is24Hour: true,
    });
  }

  function salvar() {
    const valorNumerico = parseFloat(
      valor.replace(/\./g, "").replace(",", "."),
    );

    // Basic validation
    if (
      descricao.trim().length === 0 ||
      isNaN(valorNumerico) ||
      valorNumerico <= 0
    ) {
      alert("Dados inválidos. Verifique a descrição e o valor.");
      return;
    }

    adicionarDespesa({
      descricao: descricao,
      valor: valorNumerico,
      data: data,
    });

    setDescricao("");
    setValor("0,00");
  }

  const formatarValor = (texto) => {
    const numeroLimpo = texto.replace(/\D/g, "");

    if (numeroLimpo === "") {
      setValor("0,00");
      return;
    }

    const centavos = parseInt(numeroLimpo, 10);

    const valorDecimal = centavos / 100;

    const formatado = valorDecimal.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setValor(formatado);
  };

  return (
    <View style={styles.view}>
      <TextInput
        style={styles.textInput}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.textInput}
        placeholder="0,00"
        value={valor}
        onChangeText={formatarValor}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity
        style={styles.dataContainer}
        onPress={mostrarCalendario}
      >
        <Text style={styles.dataTexto}>Data da Despesa:</Text>
        <Text style={styles.dataValor}>{data.toLocaleDateString("pt-BR")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text>Adicionar Despesa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    margin: 7,
    padding: 13,
    borderRadius: 10,
  },
  view: { backgroundColor: "#fff", flex: 1 },
  button: {
    margin: 7,
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#44bbff",
    alignItems: "center",
  },
  dataContainer: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    margin: 7,
    padding: 13,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataTexto: { color: "#666" },
  dataValor: { fontWeight: "bold", color: "#333" },
});
