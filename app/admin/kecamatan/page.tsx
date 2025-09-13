"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import KecamatanAdminDashboard from "@/components/kecamatan-admin-dashboard"
import { createClient } from "@/lib/supabase/client"

interface User {
  username: string
  role: string
}

async function getKecamatanStats() {
  const supabase = createClient()

  // Check if Supabase is configured
  if (!supabase || typeof supabase.from !== 'function') {
    console.warn("Supabase is not configured. Using mock data.")
    // Return mock data when Supabase is not configured
    return {
      desa: 1,
      tps: 1,
      kader: 2,
      coordinators: 1,
    }
  }

  try {
    // Get stats for kecamatan admin
    const [desaCount, tpsCount, kaderCount, coordinatorCount] = await Promise.all([
      supabase.from("desa").select("id", { count: "exact" }),
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
  } catch (error) {
    console.error("Error fetching kecamatan stats:", error)
    return {
      desa: 0,
      tps: 0,
      kader: 0,
      coordinators: 0,
    }
  }
}

export default function KecamatanAdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    desa: 0,
    tps: 0,
    kader: 0,
    coordinators: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem("user")

      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)

      if (parsedUser.role !== "kecamatan_admin") {
        router.push("/")
        return
      }

      setUser(parsedUser)

      // Fetch kecamatan stats
      const kecamatanStats = await getKecamatanStats()
      setStats(kecamatanStats)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nasdem-orange mx-auto mb-4"></div>
          <p className="text-nasdem-blue">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <KecamatanAdminDashboard user={user} kecamatan="Sidoarjo" stats={stats} />
}
