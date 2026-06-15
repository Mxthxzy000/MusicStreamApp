import { Heart } from "lucide-react"
import { useFavorites } from "../contexts/FavoritesContext"

export function FavoriteButton({ contentId, size = "md" }) {
  const { isFavorite, toggleFavorite } = useFavorites()

  const favorite = isFavorite(contentId)

  const dimensions = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-12 w-12",
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(contentId)
      }}
      aria-label={
        favorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
      className={`
        ${dimensions[size] || dimensions.md}
        flex items-center justify-center
        rounded-full
        backdrop-blur-md
        border
        transition-all
        hover:scale-110
        active:scale-95
        ${
          favorite
            ? "bg-primary/20 border-primary/50 text-primary neon-border"
            : "bg-card/70 border-border text-muted-foreground hover:text-primary hover:border-primary/40"
        }
      `}
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          favorite ? "fill-current" : ""
        }`}
      />
    </button>
  )
}

export default FavoriteButton