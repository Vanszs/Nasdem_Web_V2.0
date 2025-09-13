import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default async function LoginPage() {
  const supabase = createClient()
  
  // Check if Supabase is configured
  if (!supabase || typeof supabase.auth !== 'object') {
    console.warn("Supabase is not configured. Skipping session check.")
    // Skip session check when Supabase is not configured
    return (
      <div className="min-h-screen bg-gradient-to-br from-nasdem-blue via-nasdem-blue/90 to-nasdem-blue/80 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5"></div>
        <LoginForm />
      </div>
    )
  }
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nasdem-blue via-nasdem-blue/90 to-nasdem-blue/80 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5"></div>
      <LoginForm />
    </div>
  )
}
