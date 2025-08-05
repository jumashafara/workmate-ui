"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleAuthenticate } from "@/lib/api/auth";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, CheckCircle, XCircle, ArrowRight, Home, RefreshCw, Lock, UserCheck } from "lucide-react";
import { setAuthToken, setRefreshToken, setUserData } from "@/utils/cookie";

function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
              </div>
            </div>
            
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
              <Lock className="h-3 w-3 mr-1" />
              Secure Authentication
            </Badge>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Initializing Authentication
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Setting up secure connection...
              </p>
            </div>
            
            <div className="flex justify-center space-x-1">
              <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GoogleCallbackContent() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Extract the code from search params
      const code = searchParams.get("code");

      if (!code) {
        setError("No authorization code received from Google");
        setLoading(false);
        toast.error("Authentication failed: No code received from Google");
        setTimeout(() => router.push("/sign-in"), 3000);
        return;
      }

      try {
        console.log("Processing Google authentication callback with code");
        const data = await googleAuthenticate(code);

        // Save the tokens
        setAuthToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setUserData({
          email: data.user.email,
          full_name: data.user.full_name,
          username: data.user.username,
          role: data.user.role,
          region: data.user.region,
          district: data.user.district,
          superuser: data.user.is_superuser,
        });

        toast.success("Google login successful! Redirecting...");

        // Redirect to home page
        router.push("/dashboard");
      } catch (error: any) {
        console.error("Google authentication error:", error);
        setError(error.message || "Failed to authenticate with Google");
        setLoading(false);
        toast.error(error.message || "Failed to authenticate with Google");
        setTimeout(() => router.push("/sign-in"), 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {loading ? (
            <div className="space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg mx-auto">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
                </div>
              </div>
              
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                <Shield className="h-3 w-3 mr-1" />
                Verifying Credentials
              </Badge>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Completing Google Authentication
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Please wait while we securely authenticate your account...
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Verifying credentials</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                <XCircle className="h-3 w-3 mr-1" />
                Authentication Failed
              </Badge>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Authentication Failed
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {error}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => router.push("/sign-in")}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-600 dark:text-gray-400"
                  onClick={() => router.push("/")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If the problem persists, please contact support for assistance.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
