import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthLayout } from "../components/AuthLayout"
import { FormField, inputClass, SubmitButton } from "../components/FormField"
import { useAuth } from "../contexts/AuthContext"
import { isValidEmail, translateAuthError } from "../utils/validators"

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/"

  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const next = {}
    if (!isValidEmail(form.email)) next.email = "Informe um e-mail válido."
    if (!form.password) next.password = "Informe sua senha."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return
    setLoading(true)
    try {
      await signIn(form)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(translateAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para continuar ouvindo seus clássicos favoritos."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to="/register" className="font-semibold text-secondary hover:underline">
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {serverError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <FormField label="E-mail" error={errors.email} htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="voce@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </FormField>

        <FormField label="Senha" error={errors.password} htmlFor="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </FormField>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-muted-foreground hover:text-secondary"
          >
            Esqueci minha senha
          </Link>
        </div>

        <SubmitButton loading={loading}>Entrar</SubmitButton>
      </form>
    </AuthLayout>
  )
}
