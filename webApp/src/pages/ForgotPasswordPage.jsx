import { useState } from "react"
import { Link } from "react-router-dom"
import { MailCheck } from "lucide-react"
import { AuthLayout } from "../components/AuthLayout"
import { FormField, inputClass, SubmitButton } from "../components/FormField"
import { useAuth } from "../contexts/AuthContext"
import { isValidEmail, translateAuthError } from "../utils/validators"

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [serverError, setServerError] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setServerError("")
    if (!isValidEmail(email)) {
      setError("Informe um e-mail válido.")
      return
    }
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setServerError(translateAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Esqueceu a senha?"
      subtitle="Enviaremos um link para você redefinir sua senha."
      footer={
        <Link to="/login" className="font-semibold text-secondary hover:underline">
          Voltar para o login
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
            <MailCheck className="h-7 w-7" />
          </span>
          <p className="text-sm text-muted-foreground text-pretty">
            Se houver uma conta com <strong className="text-foreground">{email}</strong>, você
            receberá um e-mail com instruções para redefinir sua senha.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {serverError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <FormField label="E-mail" error={error} htmlFor="email">
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <SubmitButton loading={loading}>Enviar link de redefinição</SubmitButton>
        </form>
      )}
    </AuthLayout>
  )
}
