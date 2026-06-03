const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000"

let _token = null

export function setToken(token) {
  _token = token
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" }
  if (_token) headers["Authorization"] = `Bearer ${_token}`

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? `HTTP ${response.status}`)
  }

  // 204 não tem body
  return response.status === 204 ? null : response.json()
}

export const api = {
  setToken,

  login:    (email, password)       => request("/auth/login",    { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  refresh:  ()                      => request("/auth/refresh",  { method: "POST" }),

  listCategories:    ()        => request("/categories"),
  createCategory:    (data)    => request("/categories",        { method: "POST",   body: JSON.stringify(data) }),
  updateCategory:    (id, d)   => request(`/categories/${id}`,  { method: "PUT",    body: JSON.stringify(d) }),
  deleteCategory:    (id)      => request(`/categories/${id}`,  { method: "DELETE" }),

  listTransactions: (params) => {
    if (!params) return request("/transactions")
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
    return request(qs ? `/transactions?${qs}` : "/transactions")
  },
  createTransaction: (data)    => request("/transactions",       { method: "POST",   body: JSON.stringify(data) }),
  updateTransaction: (id, d)   => request(`/transactions/${id}`, { method: "PUT",    body: JSON.stringify(d) }),
  deleteTransaction: (id)      => request(`/transactions/${id}`, { method: "DELETE" }),
}
