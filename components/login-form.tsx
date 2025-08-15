"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, User, Lock } from "lucide-react"
import Image from "next/image"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Check credentials against predefined admin accounts
      let role = ""
      let redirectPath = "/"

      if (username === "admin1" && password === "admin1") {
        role = "super_admin"
        redirectPath = "/admin/super"
      } else if (username === "admin2" && password === "admin2") {
        role = "kecamatan_admin"
        redirectPath = "/admin/kecamatan"
      } else if (username === "admin3" && password === "admin3") {
        role = "admin"
        redirectPath = "/admin"
      } else {
        setError("Username atau password salah")
        return
      }

      // Store user session in localStorage for demo purposes
      localStorage.setItem("user", JSON.stringify({ username, role }))

      // Redirect based on role
      router.push(redirectPath)
    } catch (err) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative z-10">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-nasdem-orange rounded-full flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=60&width=60"
              alt="NasDem Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-nasdem-blue">Login Admin</CardTitle>
        <CardDescription className="text-gray-600">DPD Partai NasDem Sidoarjo</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-nasdem-blue font-medium">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="pl-10 h-12 border-gray-300 focus:border-nasdem-orange focus:ring-nasdem-orange"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-nasdem-blue font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12 border-gray-300 focus:border-nasdem-orange focus:ring-nasdem-orange"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <div className="font-medium mb-1">Demo Credentials:</div>
            <div>Super Admin: admin1 / admin1</div>
            <div>Kecamatan Admin: admin2 / admin2</div>
            <div>News Admin: admin3 / admin3</div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-nasdem-orange hover:bg-nasdem-orange/90 text-white font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Masuk...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Sistem Informasi Manajemen
          <br />
          <span className="font-semibold text-nasdem-blue">DPD NasDem Sidoarjo</span>
        </div>
      </CardContent>
    </Card>
  )
}
