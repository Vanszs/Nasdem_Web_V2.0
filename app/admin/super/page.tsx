"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SuperAdminDashboard from "@/components/super-admin-dashboard"
import { createClient } from "@/lib/supabase/client"

interface User {
  username: string
  role: string
}

async function getDashboardStats() {
  const supabase = createClient()

  try {
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
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      kecamatan: 0,
      desa: 0,
      tps: 0,
      kader: 0,
      users: 0,
      news: 0,
      gallery: 0,
    }
  }
}

export default function SuperAdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    kecamatan: 0,
    desa: 0,
    tps: 0,
    kader: 0,
    users: 0,
    news: 0,
    gallery: 0,
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

      if (parsedUser.role !== "super_admin") {
        router.push("/")
        return
      }

      setUser(parsedUser)

      // Fetch dashboard stats
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)
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

  return <SuperAdminDashboard user={user} stats={stats} />
}
