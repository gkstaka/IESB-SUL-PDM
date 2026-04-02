import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import DespesaRecente from "./screens/DespesasRecentes";
import TodasDespesas from "./screens/TodasDespesas";
import GerenciarDespesa from "./screens/GerenciarDespesa";

import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Tab = createMaterialTopTabNavigator();

function TopTabScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator style={{ paddingTop: insets.top }}>
      <Tab.Screen name="Despesas Recentes" component={DespesaRecente} />
      <Tab.Screen name="Todas Despesas" component={TodasDespesas} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [showGerenciar, setShowGerenciar] = useState(false);
  const insets = useSafeAreaInsets();
 
  return (
    <View style={styles.root}>
      <View style={styles.topArea}>
        <TopTabScreen />
      </View>

      {showGerenciar ? (
        <View style={styles.manageArea}>
          <GerenciarDespesa onClose={() => setShowGerenciar(false)} />
        </View>
      ) : (
        <View style={[styles.bottomBarContainer, { paddingBottom: insets.bottom + 12 }]}> 
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => setShowGerenciar(true)}
          >
            <Text style={styles.bottomButtonText}>Gerenciar Despesa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topArea: {
    flex: 1,
  },
  manageArea: {
    height: 340,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#f7f7f7",
  },
  bottomBarContainer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  bottomButton: {
    backgroundColor: "#007aff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
