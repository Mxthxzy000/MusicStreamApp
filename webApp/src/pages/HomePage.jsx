import { Link } from "react-router-dom"
import { Sparkles, PlayCircle } from "lucide-react"
import { useGenres } from "../hooks/useGenres"
import { useContents } from "../hooks/useContents"
import { GenreCard } from "../components/GenreCard"
import { ContentCard } from "../components/ContentCard"
import { Spinner } from "../components/Spinner"

function Hero() {
  return (
    <section className="relative overflow-hidden retro-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/60 to-background" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28 md:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
          <Sparkles className="h-3.5 w-3.5" />
          Sua máquina do tempo musical
        </span>
        <h1 className="font-display text-4xl font-extrabold leading-tight text-balance md:text-6xl">
          Reviva os clássicos no{" "}
          <span className="text-primary text-glow">Flashback Stream</span>
        </h1>
        <p className="max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
          Dos sintetizadores dos anos 80 à febre da disco music. Mergulhe em uma coleção curada de
          músicas retrô e crie a trilha sonora perfeita para a nostalgia.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/catalog"
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 neon-border"
          >
            <PlayCircle className="h-5 w-5" />
            Explorar catálogo
          </Link>
          <Link
            to="/favorites"
            className="rounded-full border border-border bg-card/60 px-6 py-3 font-display text-sm font-semibold text-foreground transition-colors hover:border-secondary"
          >
            Meus favoritos
          </Link>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const { genres, loading: genresLoading } = useGenres()
  const { contents: featured, loading: featuredLoading } = useContents({ mode: "featured", limit: 10 })

  return (
    <div>
      <Hero />

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {/* Em destaque */}
        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Em destaque</h2>
            <Link to="/catalog" className="text-sm font-medium text-secondary hover:underline">
              Ver tudo
            </Link>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {featured.map((content) => (
                <div key={content.id} className="w-44 shrink-0 sm:w-52">
                  <ContentCard content={content} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gêneros */}
        <section>
          <h2 className="mb-6 font-display text-2xl font-bold">Explore por gênero</h2>
          {genresLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {genres.map((genre) => (
                <GenreCard key={genre.id} genre={genre} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
