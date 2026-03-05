import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { rotuloBtnCadastroMeta, rotuloInputMeta, rotuloListaMetas } from "./mensagens";

export default function App() {
  return (
    <View style={styles.mainContainer}>
      <TextInput placeholder={rotuloInputMeta}></TextInput>
      <Button title={rotuloBtnCadastroMeta}></Button>
      <Text>{rotuloListaMetas}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textTitle: {
    padding: 30,
    fontSize: 40,
  },
  text: {
    padding: 30,
  },
  button: {
    backgroundColor: '#880000',
    width: 150,
    fontSize:40,
    borderColor: '#000000'
  },
  mainContainer: {
    padding: 30,

  }
});
