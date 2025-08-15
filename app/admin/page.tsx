import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RegularAdminDashboard from "@/components/regular-admin-dashboard"

async function checkAdminAccess() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userData?.role !== "admin") {
    redirect("/")
  }

  return user
}

async function getAdminStats() {
  const supabase = createClient()

  const [newsCount, galleryCount, publishedNews, draftNews] = await Promise.all([
    supabase.from("news").select("id", { count: "exact" }),
    supabase.from("gallery").select("id", { count: "exact" }),
    supabase.from("news").select("id", { count: "exact" }).eq("published", true),
    supabase.from("news").select("id", { count: "exact" }).eq("published", false),
  ])

  return {
    news: newsCount.count || 0,
    gallery: galleryCount.count || 0,
    published: publishedNews.count || 0,
    draft: draftNews.count || 0,
  }
}

export default async function AdminPage() {
  const user = await checkAdminAccess()
  const stats = await getAdminStats()

  return <RegularAdminDashboard user={user} stats={stats} />
}
