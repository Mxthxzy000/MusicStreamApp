import { useEffect, useState } from "react"
import { fetchPlans, subscribeToPlan } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

export function PlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      const data = await fetchPlans()
      setPlans(data)
      setLoading(false)
    }

    load()
  }, [])

  async function handleSubscribe(plan) {
    try {
      await subscribeToPlan(user.id, plan.id)

      alert(
        `Plano ${plan.name} ativado com sucesso!`
      )
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return <p>Carregando planos...</p>
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Escolha seu plano
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 ${
              plan.highlight
                ? "border-primary neon-border"
                : "border-border"
            }`}
          >
            <h2 className="text-2xl font-bold">
              {plan.name}
            </h2>

            <p className="my-4 text-4xl font-bold">
              R$ {Number(plan.price).toFixed(2)}
            </p>

            <ul className="mb-6 space-y-2">
              {plan.benefits.map((item, index) => (
                <li key={index}>
                  ✓ {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              className="w-full rounded-xl bg-primary px-4 py-3"
            >
              Assinar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}