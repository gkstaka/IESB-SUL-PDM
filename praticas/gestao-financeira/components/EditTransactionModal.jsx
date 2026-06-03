import { useRef, useState } from "react"
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import Button from "./Button"
import CategoryPicker from "./CategoryPicker"
import CurrencyInput from "./CurrencyInput"
import DatePicker from "./DatePicker"
import DescriptionInput from "./DescriptionInput"
import { colors } from "../constants/colors"
import { globalStyles } from "../styles/globalStyles"

export default function EditTransactionModal({ transaction, onSave, onClose }) {
  const [form, setForm] = useState({
    description: transaction.description,
    value:       Number(transaction.value),
    date:        new Date(transaction.date),
    categoryId:  transaction.categoryId,
  })
  const [saving, setSaving] = useState(false)
  // ref foco sequencial descricao valor
  const valueInputRef = useRef()

  const handleSave = async () => {
    console.log("salvando edicao:", form.description)
    setSaving(true)
    try {
      await onSave(transaction.id, {
        description: form.description,
        value:       form.value,
        date:        form.date,
        categoryId:  form.categoryId,
      })
      onClose()
    } catch {
      // erro exibido pelo pai via Alert
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={globalStyles.screenContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar transação</Text>
          {/* hitSlop amplia area toque botao fechar */}
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="close" size={24} color={colors.primaryText} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView style={globalStyles.content}>
            <View style={styles.form}>
              <DescriptionInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
              <CurrencyInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
              <DatePicker form={form} setForm={setForm} />
              <CategoryPicker form={form} setForm={setForm} />
            </View>
            <Button onPress={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryText + "40",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primaryText,
  },
  form: {
    gap: 12,
    marginBottom: 40,
    marginTop: 10,
  },
})
