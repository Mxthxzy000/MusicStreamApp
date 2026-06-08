import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export function GenreCard({ genre }) {
  return (
    <Link
      to={`/genre/${genre.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-secondary/60 hover:neon-border"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={genre.image_url || "/placeholder.svg"}
          alt={`Gênero ${genre.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
        <h3 className="font-display text-lg font-bold text-foreground text-glow">{genre.name}</h3>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
