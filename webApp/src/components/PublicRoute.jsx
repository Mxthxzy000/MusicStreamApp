import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { PageLoader } from "./Spinner"

/** Redirects already-authenticated users away from auth pages. */
export function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen retro-grid">
        <PageLoader label="Carregando..." />
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />
  return children
}
