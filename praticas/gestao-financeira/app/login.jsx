import { useState } from "react"
import {
  Alert, Keyboard, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableWithoutFeedback, View,
} from "react-native"
import { Link, Redirect, Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import Button from "../components/Button"
import LoadingScreen from "../components/LoadingScreen"
import { useAuth } from "../contexts/AuthContext"
import { colors } from "../constants/colors"
import { globalStyles } from "../styles/globalStyles"

export default function Login() {
  const { login, token, loading: authLoading } = useAuth()
  const [email,    setEmail]    = useState(process.env.EXPO_PUBLIC_DEFAULT_EMAIL    ?? "")
  const [password, setPassword] = useState(process.env.EXPO_PUBLIC_DEFAULT_PASSWORD ?? "")

  // loading separado do authLoading (boot)
  const [loading,  setLoading]  = useState(false)

  const authCarregando = authLoading

  if ( authCarregando ) return <LoadingScreen />
  if (token) return <Redirect href="/" />

  const handleLogin = async () => {
    // não adianta chamar API com campos vazios
    if (email == "" || password == "") return Alert.alert("Atenção", "Preencha e-mail e senha.")
    console.log("tentando login:", email)
    setLoading(true)
    try {
      await login(email, password)
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível fazer login.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.title}>Gestão Financeira</Text>

          <View style={globalStyles.content}>
            <Text style={globalStyles.inputLabel}>E-mail</Text>
            <TextInput
              style={globalStyles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="email@exemplo.com"
            />

            <Text style={globalStyles.inputLabel}>Senha</Text>
            <TextInput
              style={globalStyles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••"
            />

            <Button onPress={handleLogin} disabled={loading}>
              {loading == true ? "Entrando..." : "Entrar"}
            </Button>

            <Link href="/register" style={styles.link}>
              Não tem conta? Cadastre-se
            </Link>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  link: {
    textAlign: "center",
    color: colors.primary,
    marginTop: 4,
  },
})
