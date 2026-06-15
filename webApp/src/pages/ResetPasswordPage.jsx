import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)

    setTimeout(() => {
      navigate("/login")
    }, 2000)
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">
        Redefinir senha
      </h1>

      {success ? (
        <p>Senha alterada com sucesso.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p>{error}</p>}

          <button type="submit">
            Alterar senha
          </button>
        </form>
      )}
    </div>
  )
}