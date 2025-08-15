"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import RegularAdminDashboard from "@/components/regular-admin-dashboard"
import { createClient } from "@/lib/supabase/client"

interface User {
  username: string
  role: string
}

async function getAdminStats() {
  const supabase = createClient()

  try {
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
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      news: 0,
      gallery: 0,
      published: 0,
      draft: 0,
    }
  }
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    news: 0,
    gallery: 0,
    published: 0,
    draft: 0,
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

      if (parsedUser.role !== "admin") {
        router.push("/")
        return
      }

      setUser(parsedUser)

      // Fetch admin stats
      const adminStats = await getAdminStats()
      setStats(adminStats)
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

  return <RegularAdminDashboard user={user} stats={stats} />
}
