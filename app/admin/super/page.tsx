import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SuperAdminDashboard from "@/components/super-admin-dashboard"

async function checkSuperAdminAccess() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userData?.role !== "super_admin") {
    redirect("/")
  }

  return user
}

async function getDashboardStats() {
  const supabase = createClient()

  // Get organization stats
  const [kecamatanCount, desaCount, tpsCount, kaderCount, userCount, newsCount, galleryCount] = await Promise.all([
    supabase.from("kecamatan").select("id", { count: "exact" }),
    supabase.from("desa").select("id", { count: "exact" }),
    supabase.from("tps").select("id", { count: "exact" }),
    supabase.from("kaders").select("id", { count: "exact" }),
    supabase.from("users").select("id", { count: "exact" }),
    supabase.from("news").select("id", { count: "exact" }),
    supabase.from("gallery").select("id", { count: "exact" }),
  ])

  return {
    kecamatan: kecamatanCount.count || 0,
    desa: desaCount.count || 0,
    tps: tpsCount.count || 0,
    kader: kaderCount.count || 0,
    users: userCount.count || 0,
    news: newsCount.count || 0,
    gallery: galleryCount.count || 0,
  }
}

export default async function SuperAdminPage() {
  const user = await checkSuperAdminAccess()
  const stats = await getDashboardStats()

  return <SuperAdminDashboard user={user} stats={stats} />
}
