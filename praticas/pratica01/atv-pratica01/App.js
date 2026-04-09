import { StyleSheet } from "react-native";
import TodasDespesas from "./screens/TodasDespesas";
import GerenciarDespesas from "./screens/GerenciarDespesas";
import DespesasRecentes from "./screens/DespesasRecentes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";

const Tab = createMaterialTopTabNavigator();

const hoje = new Date();

function NavigationTab() {
  const [dadosDespesas, setDadosDespesas] = useState([
    {
      id: "1",
      descricao: "Conta de luz",
      valor: 100.99,
      data: new Date(2025, 2, 11),
    },
    {
      id: "2",
      descricao: "Conta de Agua",
      valor: 40.99,
      data: new Date(2025, 4, 10),
    },
    {
      id: "3",
      descricao: "Internet Fibra",
      valor: 120.0,
      data: new Date(2025, 4, 15),
    },
    {
      id: "4",
      descricao: "Supermercado",
      valor: 250.5,
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2),
    },
    {
      id: "5",
      descricao: "Combustível",
      valor: 85.0,
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 4),
    },
    {
      id: "6",
      descricao: "Aluguel",
      valor: 1500.0,
      data: new Date(2025, 2, 5),
    },
    {
      id: "7",
      descricao: "Academia",
      valor: 90.0,
      data: new Date(2025, 2, 1),
    },
    {
      id: "8",
      descricao: "Jantar Fora",
      valor: 150.0,
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1),
    },
    {
      id: "9",
      descricao: "Cinema",
      valor: 60.0,
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 3),
    },
    {
      id: "10",
      descricao: "Farmácia",
      valor: 45.5,
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5),
    },
    {
      id: "11",
      descricao: "Padaria",
      valor: 22.3,
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 6),
    },
    {
      id: "12",
      descricao: "Assinatura Streaming",
      valor: 55.9,
      data: new Date(2025, 1, 20),
    },
    {
      id: "13",
      descricao: "Manutenção Carro",
      valor: 200.0,
      data: new Date(2025, 1, 15),
    },
    {
      id: "14",
      descricao: "Presente de Aniversário",
      valor: 120.0,
      data: new Date(2025, 1, 10),
    },
    {
      id: "15",
      descricao: "Material de Escritório",
      valor: 35.0,
      data: new Date(2025, 1, 5),
    },
    {
      id: "16",
      descricao: "Consulta Médica",
      valor: 300.0,
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 8),
    },
    {
      id: "17",
      descricao: "Presente de Aniversário",
      valor: 75.0,
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 10),
    },
  ]);

  function adicionarDespesa(dadosDaNovaDespesa) {
    const novaDespesa = {
      ...dadosDaNovaDespesa,
      id: Math.floor((Math.random() * 1000).toString()),
    };

    setDadosDespesas((antigasDespesas) => {
      return [novaDespesa, ...antigasDespesas];
    });

    alert("Despesa adicionada com sucesso!");
  }

  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator style={{ paddingTop: insets.top }}>
      <Tab.Screen name="Todas Despesas">
        {(props) => <TodasDespesas dadosDespesas={dadosDespesas} />}
      </Tab.Screen>
      <Tab.Screen name="Despesas Recentes">
        {(props) => <DespesasRecentes dadosDespesas={dadosDespesas} />}
      </Tab.Screen>
      <Tab.Screen name="Gerenciar Despesas">
        {(props) => <GerenciarDespesas adicionarDespesa={adicionarDespesa} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <NavigationTab />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
