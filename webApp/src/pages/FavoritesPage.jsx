import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { HeartCrack } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useFavorites } from "../contexts/FavoritesContext"
import * as api from "../services/api"
import { ContentGrid } from "../components/ContentGrid"
import { PageLoader } from "../components/Spinner"

export function FavoritesPage() {
  const { user } = useAuth()
  const { favoriteIds } = useFavorites()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await api.fetchFavorites(user.id)
      setFavorites(data)
    } catch (err) {
      console.error("[Flashback] Erro ao carregar favoritos:", err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  // Keep the displayed list in sync when a favorite is toggled elsewhere.
  useEffect(() => {
    setFavorites((prev) => prev.filter((c) => favoriteIds.includes(c.id)))
  }, [favoriteIds])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-glow md:text-4xl">Meus favoritos</h1>
        <p className="mt-2 text-muted-foreground">
          Sua coleção pessoal de clássicos retrô.
        </p>
      </header>

      {loading ? (
        <PageLoader label="Carregando seus favoritos..." />
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HeartCrack className="h-8 w-8" />
          </span>
          <p className="text-muted-foreground">
            Você ainda não favoritou nenhuma faixa.
          </p>
          <Link
            to="/catalog"
            className="rounded-full bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 neon-border"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <ContentGrid contents={favorites} />
      )}
    </div>
  )
}
