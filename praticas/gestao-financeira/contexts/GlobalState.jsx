import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { api } from "../services/api"
import { AuthContext } from "./AuthContext"

export const MoneyContext = createContext()

const now = new Date()

const DEFAULT_FILTER = { mode: "month", month: now.getMonth(), year: now.getFullYear() }

function buildParams(filter) {
  if (filter.mode === "month") return { month: filter.month + 1, year: filter.year }
  if (filter.mode === "year")  return { year: filter.year }
  return null
}

// verifica se uma data cai dentro do período selecionado no filtro
function inPeriod(filter, date) {
  if (filter.mode === "all") return true
  if (filter.mode === "year") return date.getFullYear() === filter.year
  return date.getMonth() === filter.month && date.getFullYear() === filter.year
}

export default function GlobalState({ children }) {
  const { token } = useContext(AuthContext)

  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilterState] = useState(DEFAULT_FILTER)

  // useRef pra não precisar incluir filter nas dependências dos callbacks
  const filterRef = useRef(DEFAULT_FILTER)

  const refresh = useCallback(async () => {
    console.log("atualizando lista...")
    setLoading(true)
    setError(null)
    try {
      const [categorias, transacoes] = await Promise.all([
        api.listCategories(),
        api.listTransactions(buildParams(filterRef.current)),
      ])
      setCategories(categorias)
      setTransactions(transacoes)
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) refresh()
    else { setTransactions([]); setCategories([]) }
  }, [token, refresh])

  const setFilter = useCallback((newFilter) => {
    filterRef.current = newFilter
    setFilterState(newFilter)
    refresh()
  }, [refresh])

  const addTransaction = useCallback(async (data) => {
    const transaction = await api.createTransaction(data)
    console.log("transação criada:", transaction.id)
    // só adiciona na lista local se a data cair no período atual
    if (inPeriod(filterRef.current, new Date(transaction.date))) {
      setTransactions((prev) => [transaction, ...prev])
    }
  }, [])

  const updateTransaction = useCallback(async (id, data) => {
    const transaction = await api.updateTransaction(id, data)
    const fits = inPeriod(filterRef.current, new Date(transaction.date))
    setTransactions((prev) => {
      if (!fits) return prev.filter((t) => t.id !== id)
      return prev.map((t) => t.id === id ? transaction : t)
    })
  }, [])

  const removeTransaction = async (id) => {
    await api.deleteTransaction(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const addCategory = useCallback(async (data) => {
    const category = await api.createCategory(data)
    setCategories((prev) =>
      [...prev, category].sort((a, b) => a.displayName.localeCompare(b.displayName))
    )
  }, [])

  const removeCategory = async (id) => {
    await api.deleteCategory(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <MoneyContext.Provider value={{
      transactions, categories, loading, error,
      filter, setFilter, refresh,
      addTransaction, updateTransaction, removeTransaction,
      addCategory, removeCategory,
    }}>
      {children}
    </MoneyContext.Provider>
  )
}
