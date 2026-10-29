const API_BASE = '/api'

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : {}

  if (!response.ok) {
    const error = new Error(payload.error || 'Request failed')
    error.status = response.status
    throw error
  }

  return { data: payload }
}

export const authClient = {
  async getSession() {
    try {
      const result = await apiFetch('/session')
      return {
        data: {
          session: true,
          user: result.data.user,
        },
      }
    } catch (error) {
      if (error.status === 401) {
        return { data: { session: null, user: null } }
      }

      throw error
    }
  },

  async signIn(email, password) {
    return apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async signUp(email, password, name) {
    return apiFetch('/create-admin', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  },

  async signOut() {
    return apiFetch('/logout', { method: 'POST' })
  },
}

const legacySignIn = authClient.signIn
const legacySignUp = authClient.signUp

authClient.signIn = {
  email: async ({ email, password }) => {
    const result = await legacySignIn(email, password)
    return result.data
  },
}

authClient.signUp = {
  email: async ({ name, email, password }) => {
    const result = await legacySignUp(email, password, name)
    return result.data
  },
}
