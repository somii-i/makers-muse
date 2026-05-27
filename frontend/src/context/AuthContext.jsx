import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('mm_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback((authUser) => {
    localStorage.setItem('mm_token', authUser.token)
    localStorage.setItem('mm_user', JSON.stringify(authUser))
    setUser(authUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mm_token')
    localStorage.removeItem('mm_user')
    setUser(null)
  }, [])

  const isAuthenticated = !!user
  const isArtist   = user?.role === 'ROLE_ARTIST'
  const isCustomer  = user?.role === 'ROLE_CUSTOMER'

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isArtist, isCustomer, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
