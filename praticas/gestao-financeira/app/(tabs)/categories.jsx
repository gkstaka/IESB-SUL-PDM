import { useContext, useState } from "react"
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import CategoryItem from "../../components/CategoryItem"
import Button from "../../components/Button"
import { MoneyContext } from "../../contexts/GlobalState"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../constants/colors"

// opcoes cor fundo categoria
const SUGGESTED_COLORS = ["#FFB6B6", "#B6D7FF", "#B6FFB6", "#FFE4B6", "#E4B6FF", "#B6FFF0"]

const ICON_OPTIONS = [
  { name: "star",           label: "Favorito"     },
  { name: "work",           label: "Trabalho"     },
  { name: "home",           label: "Casa"         },
  { name: "fastfood",       label: "Alimentação"  },
  { name: "favorite",       label: "Saúde"        },
  { name: "directions-car", label: "Transporte"   },
  { name: "school",         label: "Educação"     },
  { name: "flight",         label: "Viagens"      },
  { name: "shopping-cart",  label: "Compras"      },
  { name: "fitness-center", label: "Academia"     },
]

// form padrão, resetado depois de criar
const initialForm = { name: "", displayName: "", icon: "star", background: SUGGESTED_COLORS[0], isIncome: false }

export default function Categories() {
  const { categories, addCategory, removeCategory } = useContext(MoneyContext)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [successName, setSuccessName] = useState(null)
  const [iconPickerVisible, setIconPickerVisible] = useState(false)

  const handleCreate = async () => {
    if (form.name == "" || form.displayName == "") {
      Alert.alert("Atenção", "Preencha o nome técnico e o nome de exibição.")
      return
    }
    console.log("criando categoria:", form.name)
    setSaving(true)
    try {
      // guarda o nome antes de limpar o form
      let created = form.displayName
      await addCategory(form)
      setForm(initialForm)
      setSuccessName(created)
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível criar a categoria.")
    } finally {
      setSaving(false)
    }
  }

  // a API bloqueia exclusão de categorias padrão
  const handleDelete = (item) => {
    Alert.alert(
      "Excluir categoria",
      `Deseja excluir "${item.displayName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => removeCategory(item.id) },
      ]
    )
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={globalStyles.screenContainer}>
      <Modal
        visible={iconPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIconPickerVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIconPickerVisible(false)}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Selecione um ícone</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((opt) => {
                const selected = form.icon === opt.name
                return (
                  <TouchableOpacity
                    key={opt.name}
                    style={[styles.iconOption, selected && styles.iconOptionSelected]}
                    onPress={() => { setForm({ ...form, icon: opt.name }); setIconPickerVisible(false) }}
                  >
                    <MaterialIcons
                      name={opt.name}
                      size={30}
                      color={selected ? colors.primary : colors.primaryText}
                    />
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={successName !== null}
        transparent
        animationType="fade"
        onRequestClose={ () => setSuccessName(null) }
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="check" size={40} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Categoria criada!</Text>
            <Text style={styles.modalName}>{successName}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setSuccessName(null)}>
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        style={globalStyles.content}
        ListHeaderComponent={
          <View style={styles.form}>
            <Text style={globalStyles.inputLabel}>Nome técnico (ex: cinema)</Text>
            <TextInput
              style={globalStyles.input}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              autoCapitalize="none"
              placeholder="cinema"
            />
            <Text style={globalStyles.inputLabel}>Nome de exibição (ex: Cinema)</Text>
            <TextInput
              style={globalStyles.input}
              value={form.displayName}
              onChangeText={(v) => setForm({ ...form, displayName: v })}
              placeholder="Cinema"
            />
            <Text style={globalStyles.inputLabel}>Ícone</Text>
            <TouchableOpacity style={styles.iconSelector} onPress={() => setIconPickerVisible(true)}>
              <MaterialIcons name={form.icon} size={24} color={colors.primary} />
              <Text style={styles.iconSelectorText}>
                {ICON_OPTIONS.find((o) => o.name === form.icon)?.label ?? form.icon}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={colors.secondaryText} />
            </TouchableOpacity>
            <Text style={globalStyles.inputLabel}>Tipo</Text>
            <View style={styles.typeRow}>
              {[{ label: "Despesa", value: false }, { label: "Renda", value: true }].map((opt) => {
                const selected = form.isIncome === opt.value
                const color = opt.value ? colors.positiveText : colors.negativeText
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.radioOption, selected && { borderColor: color, backgroundColor: color + "18" }]}
                    onPress={() => setForm({ ...form, isIncome: opt.value })}
                  >
                    <View style={[styles.radioCircle, { borderColor: color }, selected && { borderColor: color }]}>
                      {selected && <View style={[styles.radioDot, { backgroundColor: color }]} />}
                    </View>
                    <Text style={[styles.radioLabel, { color: selected ? color : colors.primaryText }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            <Text style={globalStyles.inputLabel}>Cor</Text>
            <View style={styles.colorRow}>
              {SUGGESTED_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorSwatch, { backgroundColor: color }, form.background === color && styles.colorSelected]}
                  onPress={() => setForm({ ...form, background: color })}
                />
              ))}
            </View>
            <Button onPress={handleCreate} disabled={saving}>
              {saving ? "Criando..." : "Criar categoria"}
            </Button>
            <View style={globalStyles.line} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.categoryRow}>
            <CategoryItem category={item} />
            <View style={styles.categoryInfo}>
              <Text style={globalStyles.primaryText}>{item.displayName}</Text>
              <Text style={globalStyles.secondaryText}>
                {item.isDefault ? "padrão" : "personalizada"}
                {item.isIncome ? " · receita" : ""}
              </Text>
            </View>
            {!item.isDefault && (
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <MaterialIcons name="delete" size={22} color={colors.negativeText} />
              </TouchableOpacity>
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={globalStyles.line} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: 8,
    marginBottom: 16,
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  radioOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  iconSelector: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  iconSelectorText: {
    flex: 1,
    fontSize: 15,
    color: colors.primaryText,
  },
  pickerModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primaryText,
    marginBottom: 16,
    textAlign: "center",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  iconOption: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  iconOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "12",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "75%",
    gap: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.positiveText,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primaryText,
  },
  modalName: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: "center",
  },
  modalBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
})
