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
