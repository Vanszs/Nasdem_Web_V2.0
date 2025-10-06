"use client";

import * as React from "react";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Shield, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput, useLogin } from "./hooks/useLogin";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const loginMut = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = (values: LoginInput) => {
    setServerError("");
    loginMut.mutate(values, {
      onSuccess: () => {
        router.replace("/admin");
      },
      onError: (err: any) => {
        setServerError(err.message || "Login gagal");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#001B55] via-[#002266] to-[#001B55]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#FF9C04]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF9C04]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,156,4,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,156,4,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#FF9C04] rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2.5 h-2.5 bg-[#FF9C04]/60 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-6xl mx-4 overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="grid lg:grid-cols-2 gap-0 bg-white/95 backdrop-blur-xl">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-[#001B55]/95 via-[#001B55]/90 to-[#002a7a]/95 text-white relative overflow-hidden backdrop-blur-sm">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9C04]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF9C04]/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-transparent via-[#FF9C04]/5 to-transparent"></div>
          
          <div className="relative z-10 space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-2xl border-2 border-white/20 p-2 bg-white/5">
                <Image
                  src="/logo-nasdem.png"
                  alt="Logo NasDem"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">NasDem</h1>
                <p className="text-white/70 text-sm">Sidoarjo Dashboard</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Welcome to<br />
                <span className="text-[#FF9C04]">Admin Portal</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Secure access to manage content, members, and analytics for DPD Partai NasDem Sidoarjo.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 pt-8">
              {[
                "Real-time Analytics Dashboard",
                "Multi-role Access Control",
                "Content Management System"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-2 h-2 bg-[#FF9C04] rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-white/80 group-hover:text-white transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center p-8 lg:p-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-xl border-2 border-[#001B55]/20 p-1.5 bg-[#001B55]/5">
              <Image
                src="/logo-nasdem.png"
                alt="Logo NasDem"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#001B55]">NasDem Sidoarjo</h1>
              <p className="text-gray-500 text-xs">Admin Portal</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-[#001B55]">Sign In</h2>
              <p className="text-gray-500">Enter your credentials to access the dashboard</p>
            </div>

            {/* Error Alert */}
            {(serverError || loginMut.isError) && (
              <Alert className="border-[#C81E1E]/30 bg-[#C81E1E]/10 animate-shake">
                <AlertDescription className="text-[#C81E1E] text-sm font-medium">
                  {serverError || (loginMut.error as any)?.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF9C04] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@nasdem.local"
                    {...form.register("email")}
                    className={cn(
                      "pl-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FF9C04] focus:ring-4 focus:ring-[#FF9C04]/10 transition-all duration-200",
                      form.formState.errors.email && "border-[#C81E1E] focus:border-[#C81E1E] focus:ring-[#C81E1E]/10"
                    )}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-[#C81E1E] font-medium">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF9C04] transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    {...form.register("password")}
                    className={cn(
                      "pl-12 pr-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FF9C04] focus:ring-4 focus:ring-[#FF9C04]/10 transition-all duration-200",
                      form.formState.errors.password && "border-[#C81E1E] focus:border-[#C81E1E] focus:ring-[#C81E1E]/10"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001B55] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-[#C81E1E] font-medium">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-gray-300 text-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20"
                  />
                  <span className="text-gray-600 group-hover:text-[#001B55] transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[#FF9C04] hover:text-[#001B55] font-medium transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMut.isPending}
                className="w-full h-14 bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#002266] text-white font-semibold rounded-xl shadow-lg shadow-[#FF9C04]/30 hover:shadow-xl hover:shadow-[#001B55]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loginMut.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Protected by enterprise-grade security • © 2025 DPD NasDem Sidoarjo
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
