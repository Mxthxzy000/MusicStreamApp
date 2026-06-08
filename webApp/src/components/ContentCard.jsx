import { Play } from "lucide-react"
import { FavoriteButton } from "./FavoriteButton"

export function ContentCard({ content }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card border border-border transition-all hover:border-primary/60 hover:neon-border">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={content.cover_url || "/placeholder.svg"}
          alt={`Capa de ${content.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />

        <div className="absolute right-3 top-3">
          <FavoriteButton contentId={content.id} size="sm" />
        </div>

        <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
          <Play className="h-5 w-5 fill-current" />
        </div>
      </div>

      <div className="p-4">
        {content.genre?.name && (
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            {content.genre.name}
          </span>
        )}
        <h3 className="mt-1 truncate font-display text-base font-semibold text-card-foreground">
          {content.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {content.synopsis}
        </p>
      </div>
    </article>
  )
}
