import { useEffect, useRef, useState } from "react"
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../constants/colors"

const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

const THIS_YEAR = new Date().getFullYear()
const MIN_YEAR  = THIS_YEAR - 5
const MAX_YEAR  = THIS_YEAR + 2

const PILL_GAP     = 8
const PILL_MONTH_W = 88  
const PILL_YEAR_W  = 62  
const SCROLL_STEP  = 1   

const BG   = colors.background        // "#F5F5F5"
const BG_T = colors.background + "00" // transparente

const MODES = [
  { key: "month", label: "Por Mês"       },
  { key: "year",  label: "Por Ano"        },
  { key: "all",   label: "Todo o Período" },
]

function generateMonthItems() {
  const items = []
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    for (let month = 0; month < 12; month++) {
      items.push({ id: `${year}-${month}`, month, year, label: `${MONTHS_SHORT[month]} ${year}` })
    }
  }
  return items
}

function generateYearItems() {
  const items = []
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    items.push({ id: String(year), year, label: String(year) })
  }
  return items
}

const MONTH_ITEMS = generateMonthItems()
const YEAR_ITEMS  = generateYearItems()

function selectedId(filter) {
  if (filter.mode === "month") return `${filter.year}-${filter.month}`
  if (filter.mode === "year")  return String(filter.year)
  return null
}

export default function MonthYearPicker({ filter, onChange }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [atStart, setAtStart] = useState(false)
  const [atEnd,   setAtEnd]   = useState(false)

  const listRef      = useRef(null)
  const scrollXRef   = useRef(0)
  const containerW   = useRef(0)

  const items     = filter.mode === "month" ? MONTH_ITEMS
                  : filter.mode === "year"  ? YEAR_ITEMS
                  : []
  const activeId  = selectedId(filter)
  const activeIdx = items.findIndex((item) => item.id === activeId)

  const pillW        = filter.mode === "year" ? PILL_YEAR_W : PILL_MONTH_W
  const itemStride   = pillW + PILL_GAP
  const contentPad   = 24  // paddingHorizontal 12 * 2
  const qtdItens   = items.length
  const totalW       = qtdItens * pillW + (qtdItens - 1) * PILL_GAP + contentPad

  // getItemLayout é obrigatório quando usa initialScrollIndex, sem ele o FlatList não sabe onde rolar
  const getItemLayout = (_, index) => ({ length: pillW, offset: itemStride * index, index })

  // atualiza flags inicio fim para desabilitar setas e fade
  const updateEdges = (offsetX) => {
    setAtStart(offsetX <= 0)
    setAtEnd(offsetX >= totalW - containerW.current - 1)
  }

  useEffect(() => {
    // rola até a pill ativa quando o modo muda (viewPosition 0.5 centraliza)
    if (listRef.current && activeIdx >= 0) {
      listRef.current.scrollToIndex({ index: activeIdx, animated: true, viewPosition: 0.5 })
    }
    const offset = itemStride * (activeIdx >= 0 ? activeIdx : 0)
    updateEdges(offset)
  }, [filter.mode])

  const scrollBy = (direction) => {
    const next = scrollXRef.current + direction * SCROLL_STEP * itemStride
    const clamped = Math.max(0, Math.min(next, totalW - containerW.current))
    listRef.current?.scrollToOffset({ offset: clamped, animated: true })
  }

  const handleSelect = (item) => {
    console.log("periodo selecionado:", item.label)
    if (filter.mode === "month") onChange({ mode: "month", month: item.month, year: item.year })
    else if (filter.mode === "year") onChange({ mode: "year", year: item.year })
  }

  const handleModeChange = (mode) => {
    setModalVisible(false)
    if (mode === "all") {
      onChange({ mode: "all" })
    } else if (mode === "month") {
      onChange({ mode: "month", month: filter.month ?? new Date().getMonth(), year: filter.year ?? THIS_YEAR })
    } else {
      onChange({ mode: "year", year: filter.year ?? THIS_YEAR })
    }
  }

  const modalAberto = modalVisible

  return (
    <View style={styles.container}>
      {filter.mode === "all" ? (
        <View style={styles.allBox}>
          <Text style={styles.allText}>Todo o período</Text>
        </View>
      ) : (
        <View style={styles.listRow}>
          <TouchableOpacity
            onPress={() => scrollBy(-1)}
            disabled={atStart}
            hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
            style={styles.arrow}
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={atStart ? colors.secondaryText + "40" : colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.listWrapper}>
            <FlatList
              ref={listRef}
              data={items}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              initialScrollIndex={activeIdx >= 0 ? activeIdx : 0}
              getItemLayout={getItemLayout}
              onLayout={(e) => { containerW.current = e.nativeEvent.layout.width }}
              onScroll={(e) => { scrollXRef.current = e.nativeEvent.contentOffset.x }}
              onMomentumScrollEnd={(e) => updateEdges(e.nativeEvent.contentOffset.x)}
              onScrollEndDrag={(e) => updateEdges(e.nativeEvent.contentOffset.x)}
              scrollEventThrottle={32}
              onScrollToIndexFailed={(info) => {
                // item ainda não foi medido, fallback pelo offset calculado
                listRef.current?.scrollToOffset({ offset: itemStride * info.index, animated: false })
              }}
              renderItem={({ item }) => {
                const active = item.id === activeId
                return (
                  <TouchableOpacity
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )
              }}
            />
            {/* grandiente dos botoes melhor estetica */}
            {!atStart && (
              <LinearGradient
                colors={[BG, BG_T]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fadeLeft}
                pointerEvents="none"
              />
            )}

            {!atEnd && (
              <LinearGradient
                colors={[BG_T, BG]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fadeRight}
                pointerEvents="none"
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => scrollBy(1)}
            disabled={atEnd}
            hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
            style={styles.arrow}
          >
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={atEnd ? colors.secondaryText + "40" : colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.menuBtn} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
        <MaterialIcons name="tune" size={22} color={colors.primary} />
      </TouchableOpacity>

      <Modal
        visible={modalAberto}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          {/* onStartShouldSetResponder evita que o toque dentro do sheet feche o backdrop */}
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.sheetTitle}>Filtrar por período</Text>

            {MODES.map((m) => {
              const active = filter.mode === m.key
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.modeRow, active && styles.modeRowActive]}
                  onPress={() => handleModeChange(m.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modeTxt, active && styles.modeTxtActive]}>
                    {m.label}
                  </Text>
                  {active && <MaterialIcons name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
              )
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  listRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    paddingHorizontal: 2,
  },
  listWrapper: {
    flex: 1,
    position: "relative",
  },
  list: {
    flex: 1,
  },
  fadeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 32,
  },
  fadeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
  },
  listContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: "center",
  },

  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary + "55",
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primaryText,
  },
  pillTextActive: {
    color: "white",
  },

  allBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  allText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },

  menuBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 4,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryText,
    textAlign: "center",
    marginBottom: 12,
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modeRowActive: {
    backgroundColor: colors.primary + "18",
  },
  modeTxt: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryText,
  },
  modeTxtActive: {
    color: colors.primary,
  },
})
