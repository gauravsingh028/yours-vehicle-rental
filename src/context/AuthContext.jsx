import React, { createContext, useContext, useMemo, useState } from 'react'
import { apiService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yours_user') || 'null') } catch { return null }
  })

  const login = async (credentials) => {
    const data = await apiService.login(credentials)
    localStorage.setItem('yours_access_token', data.access)
    localStorage.setItem('yours_refresh_token', data.refresh)
    localStorage.setItem('yours_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    await apiService.register(payload)
    return login({ email: payload.email, password: payload.password })
  }

  const logout = () => {
    localStorage.removeItem('yours_access_token')
    localStorage.removeItem('yours_refresh_token')
    localStorage.removeItem('yours_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout, isAuthenticated: Boolean(user) }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
