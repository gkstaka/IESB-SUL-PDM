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

export default function Register() {
  const { register, token, loading: authLoading } = useAuth()
  const [name,     setName]     = useState("")

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState(false)

  if (authLoading) return <LoadingScreen />
  if (token) return <Redirect href="/" />

  const handleRegister = async () => {
    if (!name || !email || !password) return Alert.alert("Atenção", "Preencha todos os campos.")
    console.log("registrando usuario:", name)
    setLoading(true)
    try {
      await register(name, email, password)
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível criar a conta.")
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
          <Text style={styles.title}>Criar Conta</Text>

          <View style={globalStyles.content}>
            <Text style={globalStyles.inputLabel}>Nome</Text>
            <TextInput
              style={globalStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
            />

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
              placeholder="mínimo 6 caracteres"
            />

            <Button onPress={handleRegister} disabled={loading}>
              {loading === true ? "Criando..." : "Criar conta"}
            </Button>

            <Link href="/login" style={styles.link}>
              Já tem conta? Entrar
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
