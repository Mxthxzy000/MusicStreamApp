import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "./AuthContext"
import { useToast } from "./ToastContext"
import * as api from "../services/api"

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [favoriteIds, setFavoriteIds] = useState([])
  const [loading, setLoading] = useState(false)

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds([])
      return
    }
    setLoading(true)
    try {
      const ids = await api.fetchFavoriteIds(user.id)
      setFavoriteIds(ids)
    } catch (err) {
      console.error("[Flashback] Erro ao carregar favoritos:", err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const isFavorite = useCallback((contentId) => favoriteIds.includes(contentId), [favoriteIds])

  const toggleFavorite = useCallback(
    async (contentId) => {
      if (!user) return
      const wasFavorite = favoriteIds.includes(contentId)
      // Optimistic update
      setFavoriteIds((prev) =>
        wasFavorite ? prev.filter((id) => id !== contentId) : [...prev, contentId],
      )
      try {
        if (wasFavorite) {
          await api.removeFavorite(user.id, contentId)
          showToast("Removido dos favoritos")
        } else {
          await api.addFavorite(user.id, contentId)
          showToast("Adicionado aos favoritos")
        }
      } catch (err) {
        // Revert on failure
        setFavoriteIds((prev) =>
          wasFavorite ? [...prev, contentId] : prev.filter((id) => id !== contentId),
        )
        showToast("Não foi possível atualizar os favoritos", "error")
        console.error("[Flashback] Erro ao alternar favorito:", err.message)
      }
    },
    [user, favoriteIds, showToast],
  )

  const value = { favoriteIds, isFavorite, toggleFavorite, loading, reload: loadFavorites }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error("useFavorites deve ser usado dentro de FavoritesProvider")
  return ctx
}
