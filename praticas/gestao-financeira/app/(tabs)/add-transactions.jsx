import { useContext, useRef, useState } from "react"
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import Button from "../../components/Button"
import CategoryPicker from "../../components/CategoryPicker"
import CurrencyInput from "../../components/CurrencyInput"
import DatePicker from "../../components/DatePicker"
import DescriptionInput from "../../components/DescriptionInput"
import { MoneyContext } from "../../contexts/GlobalState"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../constants/colors"

export default function AddTransactions() {
  const { categories, addTransaction } = useContext(MoneyContext)

  let defaultCategoryId = categories.find((c) => c.isIncome)?.id
  defaultCategoryId = defaultCategoryId ?? categories[0]?.id ?? ""

  const [form, setForm] = useState({ description: "", value: 0, date: new Date(), categoryId: defaultCategoryId })
  const [saving, setSaving] = useState(false)
  const [successDesc, setSuccessDesc] = useState(null)
  // ref pra foco sequencial entre os inputs
  const valueInputRef = useRef()

  const handleAdd = async () => {
    console.log("salvando transacao:", form)
    setSaving(true)
    try {
      // guarda a descrição antes de limpar o form
      const desc = form.description
      await addTransaction({
        description: form.description,
        value: form.value,
        date: form.date,
        categoryId: form.categoryId,
      })
      setForm({ description: "", value: 0, date: new Date(), categoryId: defaultCategoryId })
      setSuccessDesc(desc || "Transação")
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível salvar a transação.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={globalStyles.screenContainer}>


      <Modal
        visible={successDesc !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessDesc(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="check" size={40} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Transação adicionada!</Text>
            <Text style={styles.modalName}>{successDesc}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setSuccessDesc(null)}>
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView style={globalStyles.screenContainer} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={globalStyles.content}>
            <View style={styles.form}>
              <DescriptionInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
              <CurrencyInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
              <DatePicker form={form} setForm={setForm} />
              <CategoryPicker form={form} setForm={setForm} />
            </View>
            <Button onPress={handleAdd} disabled={saving}>
              {saving ? "Salvando..." : "Adicionar"}
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: 12,

    marginBottom: 40,
    marginTop: 10,
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
