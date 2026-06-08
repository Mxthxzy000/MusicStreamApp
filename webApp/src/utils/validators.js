/** Validation and formatting helpers. */

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6
}

/** Validates a Brazilian CPF using the official check-digit algorithm. */
export function isValidCPF(cpf) {
  const cleaned = String(cpf).replace(/\D/g, "")
  if (cleaned.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  const calcDigit = (slice) => {
    let sum = 0
    for (let i = 0; i < slice.length; i++) {
      sum += Number(slice[i]) * (slice.length + 1 - i)
    }
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const digit1 = calcDigit(cleaned.slice(0, 9))
  const digit2 = calcDigit(cleaned.slice(0, 10))
  return digit1 === Number(cleaned[9]) && digit2 === Number(cleaned[10])
}

export function formatCPF(value) {
  return String(value)
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

export function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function translateAuthError(message = "") {
  const map = {
    "Invalid login credentials": "E-mail ou senha incorretos.",
    "User already registered": "Este e-mail já está cadastrado.",
    "Email not confirmed": "Confirme seu e-mail antes de entrar.",
    "Password should be at least 6 characters": "A senha deve ter ao menos 6 caracteres.",
  }
  return map[message] || message || "Ocorreu um erro. Tente novamente."
}
