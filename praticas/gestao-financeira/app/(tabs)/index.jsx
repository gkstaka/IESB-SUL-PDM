import { useContext, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import TransactionItem from "../../components/TransactionItem"
import MonthYearPicker from "../../components/MonthYearPicker"
import EditTransactionModal from "../../components/EditTransactionModal"
import { MoneyContext } from "../../contexts/GlobalState"
import { useAuth } from "../../contexts/AuthContext"
import { globalStyles } from "../../styles/globalStyles"
import { colors } from "../../constants/colors"

export default function Transactions() {
  const {
    transactions, loading, error,
    filter, setFilter,
    refresh, updateTransaction, removeTransaction,
  } = useContext(MoneyContext)
  const { user } = useAuth()

  const [editingTx, setEditingTx] = useState(null)
  const [actionTx, setActionTx] = useState(null)
  const [deletingTx, setDeletingTx] = useState(null)  // aguardando confirmação de exclusão

  // long press abre o menu de ações
  const handleLongPress = (item) => {
    console.log("abrindo acoes:", item.description)
    setActionTx(item)
  }

  const handleDeleteConfirm = () => {
    var id = deletingTx.id
    removeTransaction(id)
    setDeletingTx(null)
  }

  const handleSave = async (id, data) => {
    try {
      await updateTransaction(id, data)
    } catch (e) {
      // relança pra o modal exibir o erro
      Alert.alert("Erro", e.message ?? "Não foi possível salvar a alteração.")
      throw e
    }
  }

  if ( loading ) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={[globalStyles.screenContainer, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={[globalStyles.screenContainer, styles.centered]}>
        <Text style={globalStyles.primaryText}>{error}</Text>
        <Text style={[globalStyles.primaryText, { color: colors.primary }]} onPress={refresh}>
          Tentar novamente
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={globalStyles.screenContainer}>

      {/* modal de ações */}
      <Modal
        visible={actionTx !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActionTx(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setActionTx(null)}>
          <View style={styles.actionModal}>
            <Text style={styles.actionTitle} numberOfLines={2}>{actionTx?.description}</Text>
            <View style={globalStyles.line} />
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => { setEditingTx(actionTx); setActionTx(null) }}
            >
              <MaterialIcons name="edit" size={22} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>Editar</Text>
            </TouchableOpacity>
            <View style={globalStyles.line} />
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => { setDeletingTx(actionTx); setActionTx(null) }}
            >
              <MaterialIcons name="delete" size={22} color={colors.negativeText} />
              <Text style={[styles.actionText, { color: colors.negativeText }]}>Excluir</Text>
            </TouchableOpacity>
            <View style={globalStyles.line} />
            <TouchableOpacity style={styles.actionRow} onPress={() => setActionTx(null)}>
              <Text style={[styles.actionText, { color: colors.secondaryText }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={deletingTx !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeletingTx(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setDeletingTx(null)}>
          <View style={styles.confirmModal}>
            <View style={styles.deleteIconCircle}>
              <MaterialIcons name="delete-outline" size={36} color="#fff" />
            </View>
            <Text style={styles.confirmTitle}>Excluir transação?</Text>
            <Text style={styles.confirmDesc} numberOfLines={2}>{deletingTx?.description}</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.cancelBtn]}
                onPress={() => setDeletingTx(null)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.deleteBtn]}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.deleteBtnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        style={globalStyles.content}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)} delayLongPress={400}>
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.welcome}>Olá, {user?.name}!</Text>
            <MonthYearPicker filter={filter} onChange={setFilter} />
            <View style={globalStyles.line} />
          </View>
        }
        ListEmptyComponent={
          <Text style={globalStyles.secondaryText}>Nenhuma transação neste período.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} colors={[colors.primary]} />
        }
      />

      {editingTx && (
        <EditTransactionModal
          transaction={editingTx}
          onSave={handleSave}
          onClose={() => setEditingTx(null)}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

  centered: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  // modal de ações (editar / excluir)
  actionModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "80%",
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.secondaryText,
    paddingHorizontal: 20,
    paddingVertical: 14,
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  confirmModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    width: "78%",
    gap: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  deleteIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.negativeText,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  confirmTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.primaryText,
  },
  confirmDesc: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: colors.secondaryText,
  },
  cancelBtnText: {
    color: colors.secondaryText,
    fontWeight: "600",
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: colors.negativeText,
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
})
