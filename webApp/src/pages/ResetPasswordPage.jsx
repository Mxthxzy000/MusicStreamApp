import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle2, KeyRound } from "lucide-react"

import { supabase } from "../services/supabaseClient"
import { AuthLayout } from "../components/AuthLayout"
import { FormField, inputClass, SubmitButton } from "../components/FormField"

export function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

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

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setSuccess(true)

      setTimeout(() => {
        navigate("/login")
      }, 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Escolha uma nova senha para acessar sua conta."
    >
      {success ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-secondary">
            <CheckCircle2 className="h-8 w-8" />
          </span>

          <div>
            <h3 className="font-display text-lg font-bold">
              Senha alterada com sucesso
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Você será redirecionado para o login em instantes.
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <FormField
            label="Nova senha"
            htmlFor="password"
          >
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="password"
                type="password"
                placeholder="Digite sua nova senha"
                className={`${inputClass} pl-10`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </FormField>

          <FormField
            label="Confirmar senha"
            htmlFor="confirmPassword"
          >
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua nova senha"
                className={`${inputClass} pl-10`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </FormField>

          <SubmitButton loading={loading}>
            Alterar senha
          </SubmitButton>
        </form>
      )}
    </AuthLayout>
  )
}

export default ResetPasswordPage