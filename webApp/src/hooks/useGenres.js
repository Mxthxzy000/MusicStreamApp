import { useEffect, useState } from "react"
import * as api from "../services/api"

export function useGenres() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    api
      .fetchGenres()
      .then((data) => mounted && setGenres(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  return { genres, loading, error }
}
