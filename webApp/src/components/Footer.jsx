import { Disc3 } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Disc3 className="h-4 w-4" />
          </span>
          <span className="font-display font-bold">
            Flashback <span className="text-secondary">Stream</span>
          </span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Reviva os clássicos. Músicas retrô para todas as gerações.
        </p>
        <p className="text-sm text-muted-foreground">
          {`© ${new Date().getFullYear()} Flashback Stream`}
        </p>
      </div>
    </footer>
  )
}
