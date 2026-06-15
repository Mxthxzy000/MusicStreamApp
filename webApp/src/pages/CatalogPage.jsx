import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useContents } from "../hooks/useContents"
import { useGenres } from "../hooks/useGenres"
import { ContentGrid } from "../components/ContentGrid"
import { PageLoader } from "../components/Spinner"
import { inputClass } from "../components/FormField"

export function CatalogPage() {
  const { contents, loading } = useContents({ mode: "all" })
  const { genres } = useGenres()
  const [query, setQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return contents.filter((c) => {
      const matchesGenre = activeGenre === "all" || c.genre?.slug === activeGenre
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        (c.synopsis || "").toLowerCase().includes(q)
      return matchesGenre && matchesQuery
    })
  }, [contents, query, activeGenre])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-glow md:text-4xl">Catálogo</h1>
        <p className="mt-2 text-muted-foreground">
          Navegue por toda a coleção retrô e descubra novas faixas.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className={`${inputClass} pl-11`}
            aria-label="Buscar conteúdo"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={activeGenre === "all"} onClick={() => setActiveGenre("all")}>
            Todos
          </FilterChip>
          {genres.map((g) => (
            <FilterChip
              key={g.id}
              active={activeGenre === g.slug}
              onClick={() => setActiveGenre(g.slug)}
            >
              {g.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {loading ? (
        <PageLoader label="Carregando o catálogo..." />
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Nenhum resultado encontrado para sua busca.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{filtered.length} resultado(s)</p>
          <ContentGrid contents={filtered} />
        </>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground neon-border"
          : "border border-border bg-card/50 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}
