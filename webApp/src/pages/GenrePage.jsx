import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import * as api from "../services/api"
import { ContentGrid } from "../components/ContentGrid"
import { PageLoader } from "../components/Spinner"

export function GenrePage() {
  const { slug } = useParams()
  const [genre, setGenre] = useState(null)
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    async function load() {
      try {
        const g = await api.fetchGenreBySlug(slug)
        if (!mounted) return
        setGenre(g)
        const c = await api.fetchContentsByGenre(g.id)
        if (mounted) setContents(c)
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) return <PageLoader label="Carregando o gênero..." />

  if (error || !genre) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6">
        <p className="text-muted-foreground">Não foi possível carregar este gênero.</p>
        <Link to="/" className="mt-4 inline-block text-secondary hover:underline">
          Voltar ao início
        </Link>
      </div>
    )
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={genre.image_url || "/placeholder.svg"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="font-display text-4xl font-extrabold text-glow md:text-5xl">
            {genre.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {contents.length} faixas clássicas para você curtir.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <ContentGrid contents={contents} />
      </div>
    </div>
  )
}
