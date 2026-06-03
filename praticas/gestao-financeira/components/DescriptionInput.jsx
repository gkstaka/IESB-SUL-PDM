import { Text, TextInput, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"

export default function DescriptionInput({ form, setForm, valueInputRef }) {
  const descricao = form.description
  return (
    <View>
      <Text style={globalStyles.inputLabel}>Descrição</Text>
      <TextInput
        value={descricao}
        returnKeyType="next"
        onChangeText={(text) => setForm({ ...form, description: text })}
        onSubmitEditing={() => valueInputRef.current.focus()}
        style={globalStyles.input}
      />
    </View>
  )
}
