import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || ""
  const supabaseAnonKey = 
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[Flashback] Variáveis de ambiente do Supabase ausentes. Verifique a integração do Supabase.",
    )
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(supabaseAnonKey),
    },
    server: {
      host: true,
      allowedHosts: true,
    },
  }
})
