export function Spinner({ className = "" }) {
  return (
    <div
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary ${className}`}
      role="status"
      aria-label="Carregando"
    />
  )
}

export function PageLoader({ label = "Carregando..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
