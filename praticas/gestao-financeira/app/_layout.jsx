import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AuthState from "../contexts/AuthContext"
import GlobalState from "../contexts/GlobalState"
import { colors } from "../constants/colors"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthState>
        <GlobalState>
          <StatusBar backgroundColor={colors.primary} style="light" />
          <Stack>
            <Stack.Screen name="(tabs)"     options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GlobalState>
      </AuthState>
    </SafeAreaProvider>
  )
}
