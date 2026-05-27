import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext(undefined)

const CART_KEY = 'mm_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((artwork) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.artwork.id === artwork.id)
      if (existing) {
        return prev.map((i) =>
          i.artwork.id === artwork.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { artwork, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((artworkId) => {
    setItems((prev) => prev.filter((i) => i.artwork.id !== artworkId))
  }, [])

  const updateQuantity = useCallback((artworkId, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.artwork.id !== artworkId))
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.artwork.id === artworkId ? { ...i, quantity: qty } : i
        )
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const isInCart = useCallback(
    (artworkId) => items.some((i) => i.artwork.id === artworkId),
    [items]
  )

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total     = items.reduce((sum, i) => sum + i.artwork.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
