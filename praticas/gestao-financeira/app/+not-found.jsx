// Tela exibida quando uma rota não existe no app.
import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function NotFoundScreen() {
  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={{ flex: 1 }}>
      <Text>Não enconrado</Text>
    </SafeAreaView>
  )
}
