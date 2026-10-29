const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    throw new Error(payload?.error || payload || 'Request failed')
  }

  return payload
}

async function signInWithCredentials(email, password) {
  try {
    const result = await request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    return {
      data: {
        session: Boolean(result?.ok && result?.user),
        user: result?.user ?? null,
      },
    }
  } catch (error) {
    return {
      error: {
        message: error?.message || 'Unable to sign in',
      },
    }
  }
}

async function signUpWithCredentials(email, password, name) {
  try {
    const result = await request('/api/create-admin', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })

    return {
      data: {
        session: Boolean(result?.ok && result?.user),
        user: result?.user ?? null,
      },
    }
  } catch (error) {
    return {
      error: {
        message: error?.message || 'Unable to create account',
      },
    }
  }
}

export const authClient = {
  async getSession() {
    try {
      const result = await request('/api/session')
      return {
        data: {
          session: Boolean(result?.ok && result?.user),
          user: result?.user ?? null,
        },
      }
    } catch (_error) {
      return { data: { session: false, user: null } }
    }
  },

  async signOut() {
    try {
      await request('/api/logout', { method: 'POST' })
      return { data: { ok: true } }
    } catch (_error) {
      return { data: { ok: true } }
    }
  },
}

authClient.signIn = {
  email: async ({ email, password }) => signInWithCredentials(email, password),
}

authClient.signUp = {
  email: async ({ name, email, password }) => signUpWithCredentials(email, password, name),
}
