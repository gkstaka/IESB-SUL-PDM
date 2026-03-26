import { StyleSheet, Text, View } from "react-native";
import DespesaRecente from "./screens/DespesasRecentes";
import TodasDespesas from "./screens/TodasDespesas";
import { NavigationContainer } from "@react-navigation/native";
import GerenciarDespesa from "./screens/GerenciarDespesa";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

function BottomTabScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="DespesasRecentes"
        component={DespesaRecente}
      ></Tab.Screen>
      <Tab.Screen
        name="GerenciarDespesa"
        component={GerenciarDespesa}
      ></Tab.Screen>
      <Tab.Screen name="TodasDespesas" component={TodasDespesas}></Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaView>
      <NavigationContainer>
        <BottomTabScreen />
      </NavigationContainer>
    </SafeAreaView>
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
