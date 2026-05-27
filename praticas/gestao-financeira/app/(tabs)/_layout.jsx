import { Redirect, Tabs, usePathname, useRouter } from "expo-router"
import { colors } from "../../constants/colors"
import { MaterialIcons } from "@expo/vector-icons"
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRef } from "react"
import { useAuth } from "../../contexts/AuthContext"
import LoadingScreen from "../../components/LoadingScreen"

// sincronizar com Tabs.Screen abaixo
const TAB_PATHS = ["/", "/add-transactions", "/categories", "/summary"]

// px minimo arrasto confirmacao troca tab
const SWIPE_THRESHOLD = 50


// largura capturada uma vez evita chamadas repetidas
const SCREEN_WIDTH = Dimensions.get("window").width

// duracao animacao entrada tela ms
const SLIDE_DURATION = 240

export default function TabsLayout() {
  const { token, loading, logout } = useAuth()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const pathname = usePathname()

  const isLoading = loading

  // ref evita rerender mantem indice atual acessivel no panResponder
  const indexRef = useRef(0)
  indexRef.current = Math.max(0, TAB_PATHS.indexOf(pathname))

  console.log("tab atual:", pathname)

  // desloca tabs horizontalmente durante swipe
  const translateX = useRef(new Animated.Value(0)).current


  // useRef evita recriacao a cada render
  const panResponder = useRef(
    PanResponder.create({
      // toque simples nao captura apenas movimento horizontal captura
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      // gesto aceito horizontal
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 2,

      onPanResponderMove: (_, gs) => {
        const idx = indexRef.current
        // bloqueia arrasto alem das extremidades
        if ((gs.dx > 0 && idx === 0) || (gs.dx < 0 && idx === TAB_PATHS.length - 1)) return
        translateX.setValue(gs.dx)
      },

      onPanResponderRelease: (_, gs) => {
        const idx = indexRef.current
        const isLeft = gs.dx < 0
        const canNavigate = isLeft ? idx < TAB_PATHS.length - 1 : idx > 0

        // arrasto curto ou sem proxima tab spring volta origem
        if (Math.abs(gs.dx) < SWIPE_THRESHOLD || !canNavigate) {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start()
          return
        }

        const nextPath = TAB_PATHS[isLeft ? idx + 1 : idx - 1]

        // navega imediatamente desliza tela entrada borda oposta
        // salto SCREEN_WIDTH fora area visivel menos 1 frame
        router.navigate(nextPath)
        translateX.setValue(isLeft ? SCREEN_WIDTH : -SCREEN_WIDTH)
        Animated.timing(translateX, {
          toValue: 0,
          duration: SLIDE_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start()
      },

      // gesto interrompido externamente spring volta origem
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start()
      },
    })
  ).current

  // aguarda verificacao token jwt boot
  if ( isLoading ) return <LoadingScreen />

  // sem sessao redireciona login
  if (!token) return <Redirect href="/login" />

  return (
    // panHandlers na raiz capturam swipes toda tela
    <View style={{ flex: 1, backgroundColor: colors.background }} {...panResponder.panHandlers}>
      <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
        <Tabs
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.primaryContrast,
            headerTitleAlign: "center",
            // logout visivel todos headers
            headerRight: () => (
              <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
                <MaterialIcons name="logout" size={24} color={colors.primaryContrast} />
              </TouchableOpacity>
            ),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.inactive,
            // altura dinamica safe area notch home indicator
            tabBarStyle: {
              height: 60 + insets.bottom,
              paddingTop: 5,
              paddingBottom: insets.bottom,
              backgroundColor: colors.background,
            },
            tabBarHideOnKeyboard: true,
            tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.8} />,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Transações",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="attach-money" size={28} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="add-transactions"
            options={{
              title: "Adicionar",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="add-circle-outline" size={28} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="categories"
            options={{
              title: "Categorias",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="category" size={28} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="summary"
            options={{
              title: "Resumo",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="pie-chart" size={28} color={color} />
              ),
            }}
          />
        </Tabs>
      </Animated.View>
    </View>
  )
}
