"use client";

import * as React from "react";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#001B55] to-[#002a7a] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#001B55] mb-2">
            Selamat Datang
          </h1>
          <p className="text-gray-600 text-sm">
            Masuk ke dashboard admin DPD NasDem Sidoarjo
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-[#001B55]">
              Masuk
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Gunakan email dan password untuk mengakses sistem
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {(serverError || loginMut.isError) && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700 text-sm">
                  {serverError || (loginMut.error as any)?.message}
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[#001B55]"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@nasdem.local"
                  {...form.register("email")}
                  className={cn(
                    "h-12 border-gray-200 focus:border-[#FF9C04] focus:ring-[#FF9C04] rounded-xl bg-white/60 backdrop-blur-sm transition-all duration-200",
                    form.formState.errors.email &&
                      "border-red-400 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-[#001B55]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    {...form.register("password")}
                    className={cn(
                      "h-12 border-gray-200 focus:border-[#FF9C04] focus:ring-[#FF9C04] rounded-xl bg-white/60 backdrop-blur-sm pr-10 transition-all duration-200",
                      form.formState.errors.password &&
                        "border-red-400 focus:border-red-500 focus:ring-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001B55] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMut.isPending}
                className={cn(
                  "w-full h-12 bg-gradient-to-r from-[#001B55] to-[#002a7a] hover:from-[#002a7a] hover:to-[#001B55] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
                  loginMut.isPending && "opacity-50 cursor-not-allowed"
                )}
              >
                {loginMut.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Masuk
                  </div>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500">
                © 2024 DPD Partai NasDem Sidoarjo. Semua hak dilindungi.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Sistem Manajemen Internal • Versi 2.0
          </p>
        </div>
      </div>
    </div>
  );
}
