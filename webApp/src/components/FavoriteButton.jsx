import { Heart } from "lucide-react"
import { useFavorites } from "../contexts/FavoritesContext"

export function FavoriteButton({ contentId, size = "md" }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(contentId)

  const dimensions = size === "sm" ? "h-9 w-9" : "h-11 w-11"
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(contentId)
      }}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={`${dimensions} flex items-center justify-center rounded-full glass transition-all hover:scale-110 ${
        active ? "text-primary neon-border" : "text-foreground/70 hover:text-primary"
      }`}
    >
      <Heart className={`${iconSize} ${active ? "fill-primary" : ""}`} />
    </button>
  )
}
