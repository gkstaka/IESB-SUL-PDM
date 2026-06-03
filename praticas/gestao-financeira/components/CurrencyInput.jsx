import { Text, TextInput, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"

function formatarMoeda(valor) {
  const centavos = String(Math.round(valor * 100)).padStart(3, "0")
  let inteiro = centavos.slice(0, -2)
  const decimal = centavos.slice(-2)
  inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `R$ ${inteiro},${decimal}`
}

export default function CurrencyInput({ form, setForm, valueInputRef }) {
  const handleCurrencyChange = (text) => {
    const digitos = text.replace(/\D/g, "")

    const numero = digitos ? parseInt(digitos, 10) : 0
    let valor = Number((numero / 100).toFixed(2))
    setForm({ ...form, value: valor })
  }

  return (
    <View>
      <Text style={globalStyles.inputLabel}>Valor</Text>
      <TextInput
        ref={valueInputRef}
        value={formatarMoeda(form.value)}
        onChangeText={handleCurrencyChange}
        keyboardType="numeric"
        style={globalStyles.input}
      />
    </View>
  )
}
