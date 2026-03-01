import { createContext, useState, useContext, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // Initialize user on mount if token exists
  useEffect(() => {
    if (token) {
      // Verify token and set user
      const verifyToken = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const userData = await res.json()
            setUser(userData)
          } else {
            // Token invalid, clear it
            localStorage.removeItem('access_token')
            setToken(null)
          }
        } catch (err) {
          console.error('Token verification failed:', err)
          localStorage.removeItem('access_token')
          setToken(null)
        }
      }
      verifyToken()
    }
  }, []) // Only run once on mount

  const signup = useCallback(async (username, email, password, beltRank = 'white', academy = null) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          belt_rank: beltRank,
          academy: academy || '',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Signup failed')
      }

      const userData = await res.json()
      // After signup, auto-login
      await login(email, password)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login-json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          remember_me: rememberMe,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Login failed')
      }

      const { access_token } = await res.json()
      localStorage.setItem('access_token', access_token)
      setToken(access_token)

      // Fetch user data
      const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData)
      }

      return { access_token }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    setToken(null)
    setUser(null)
  }, [])

  const forgotPassword = useCallback(async (email) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Request failed')
      }

      return await res.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Reset failed')
      }

      return await res.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signup, login, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
