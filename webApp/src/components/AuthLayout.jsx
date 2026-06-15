import { Link } from "react-router-dom"
import { Disc3 } from "lucide-react"

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center retro-grid px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground neon-border">
            <Disc3 className="h-6 w-6" />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-glow">
            Flashback <span className="text-secondary">Stream</span>
          </span>
        </Link>

        <div className="glass rounded-3xl p-6 shadow-2xl sm:p-8">
          <h1 className="font-display text-2xl font-bold text-balance">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground text-pretty">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  )
}
