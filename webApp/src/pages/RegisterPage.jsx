import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthLayout } from "../components/AuthLayout"
import { FormField, inputClass, SubmitButton } from "../components/FormField"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import {
  isValidCPF,
  isValidEmail,
  isValidPassword,
  formatCPF,
  translateAuthError,
} from "../utils/validators"

const initialForm = { name: "", email: "", cpf: "", address: "", password: "", confirm: "" }

export function RegisterPage() {
  const { signUp } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = "Informe seu nome completo."
    if (!isValidEmail(form.email)) next.email = "Informe um e-mail válido."
    if (!isValidCPF(form.cpf)) next.cpf = "CPF inválido."
    if (form.address.trim().length < 5) next.address = "Informe um endereço válido."
    if (!isValidPassword(form.password)) next.password = "A senha deve ter ao menos 6 caracteres."
    if (form.password !== form.confirm) next.confirm = "As senhas não coincidem."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return
    setLoading(true)
    try {
      await signUp({
        email: form.email,
        password: form.password,
        name: form.name.trim(),
        cpf: form.cpf.replace(/\D/g, ""),
        address: form.address.trim(),
      })
      showToast("Conta criada! Você já pode entrar.")
      navigate("/login")
    } catch (err) {
      setServerError(translateAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Junte-se ao Flashback Stream e mergulhe nas músicas retrô."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold text-secondary hover:underline">
            Entrar
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

        <FormField label="Nome completo" error={errors.name} htmlFor="name">
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={inputClass}
            placeholder="Maria Silva"
            value={form.name}
            onChange={update("name")}
          />
        </FormField>

        <FormField label="E-mail" error={errors.email} htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="voce@email.com"
            value={form.email}
            onChange={update("email")}
          />
        </FormField>

        <FormField label="CPF" error={errors.cpf} htmlFor="cpf">
          <input
            id="cpf"
            type="text"
            inputMode="numeric"
            className={inputClass}
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
          />
        </FormField>

        <FormField label="Endereço" error={errors.address} htmlFor="address">
          <input
            id="address"
            type="text"
            autoComplete="street-address"
            className={inputClass}
            placeholder="Rua, número, cidade"
            value={form.address}
            onChange={update("address")}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Senha" error={errors.password} htmlFor="password">
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
            />
          </FormField>

          <FormField label="Confirmar senha" error={errors.confirm} htmlFor="confirm">
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              placeholder="••••••••"
              value={form.confirm}
              onChange={update("confirm")}
            />
          </FormField>
        </div>

        <SubmitButton loading={loading}>Criar conta</SubmitButton>
      </form>
    </AuthLayout>
  )
}
