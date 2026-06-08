import { useEffect, useState } from "react"
import * as api from "../services/api"

/**
 * Generic content fetching hook.
 * @param {Object} options
 * @param {"all"|"genre"|"featured"} options.mode
 * @param {number} [options.genreId]
 * @param {number} [options.limit]
 */
export function useContents({ mode = "all", genreId, limit } = {}) {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    const fetcher = () => {
      if (mode === "genre" && genreId) return api.fetchContentsByGenre(genreId)
      if (mode === "featured") return api.fetchFeaturedContents(limit)
      return api.fetchContents()
    }

    fetcher()
      .then((data) => mounted && setContents(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [mode, genreId, limit])

  return { contents, loading, error }
}
