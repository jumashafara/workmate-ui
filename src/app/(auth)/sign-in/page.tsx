"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { signInSchema, type SignInFormData } from "@/lib/schemas/auth"
import { login, getGoogleAuthUrl, googleAuthenticate } from "@/api/auth"
import { setAuthToken, setRefreshToken, setUserData } from "@/utils/ccokie"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check for Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    
    if (code) {
      handleGoogleCallback(code)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await login({ username: data.email, password: data.password })
      
      // Save the tokens
      setAuthToken(response.access_token)
      setRefreshToken(response.refresh_token)
      setUserData({
        email: response.user.email,
        full_name: response.user.full_name,
        username: response.user.username,
        role: response.user.role,
        region: response.user.region,
        district: response.user.district,
        superuser: response.user.is_superuser
      })
      
      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleCallback = async (code: string) => {
    try {
      setIsGoogleLoading(true)
      const response = await googleAuthenticate(code)
      
      // Save the tokens
      setAuthToken(response.access_token)
      setRefreshToken(response.refresh_token)
      setUserData({
        email: response.user.email,
        full_name: response.user.full_name,
        username: response.user.username,
        role: response.user.role,
        region: response.user.region,
        district: response.user.district,
        superuser: response.user.is_superuser
      })
      
      router.push("/dashboard")
    } catch (err: any) {
      setIsGoogleLoading(false)
      setError("Google authentication failed: " + err.message)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")

    try {
      const authUrl = await getGoogleAuthUrl()
      window.location.href = authUrl
    } catch (err: any) {
      setIsGoogleLoading(false)
      setError("Failed to initiate Google login: " + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="mt-1 relative">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="pl-10"
              placeholder="Enter your email"
            />
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-1 relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              className="pl-10 pr-10"
              placeholder="Enter your password"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-orange-600 hover:text-orange-500"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in with Google...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-orange-600 hover:text-orange-500"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}