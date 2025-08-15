import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import KecamatanAdminDashboard from "@/components/kecamatan-admin-dashboard"

async function checkKecamatanAdminAccess() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("role, kecamatan").eq("id", user.id).single()

  if (userData?.role !== "kecamatan_admin") {
    redirect("/")
  }

  return { user, kecamatan: userData.kecamatan }
}

async function getKecamatanStats(kecamatan: string) {
  const supabase = createClient()

  // Get stats for specific kecamatan
  const [desaCount, tpsCount, kaderCount, coordinatorCount] = await Promise.all([
    supabase.from("desa").select("id", { count: "exact" }).eq("kecamatan_id", kecamatan),
    supabase.from("tps").select("id", { count: "exact" }),
    supabase.from("kaders").select("id", { count: "exact" }),
    supabase.from("users").select("id", { count: "exact" }).eq("role", "user"),
  ])

  return {
    desa: desaCount.count || 0,
    tps: tpsCount.count || 0,
    kader: kaderCount.count || 0,
    coordinators: coordinatorCount.count || 0,
  }
}

export default async function KecamatanAdminPage() {
  const { user, kecamatan } = await checkKecamatanAdminAccess()
  const stats = await getKecamatanStats(kecamatan)

  return <KecamatanAdminDashboard user={user} kecamatan={kecamatan} stats={stats} />
}
