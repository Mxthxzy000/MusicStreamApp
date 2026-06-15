import { BrowserRouter } from "react-router-dom"
import { ToastProvider } from "./contexts/ToastContext"
import { AuthProvider } from "./contexts/AuthContext"
import { FavoritesProvider } from "./contexts/FavoritesContext"
import { AppRoutes } from "./routes"

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <FavoritesProvider>
            <AppRoutes />
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
