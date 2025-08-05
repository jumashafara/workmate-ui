"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleAuthenticate } from "@/api/auth";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Shield, ArrowRight, Home } from "lucide-react";
import { setAuthToken, setRefreshToken, setUserData } from "@/utils/cookie";

// Skeleton loader component
const GoogleCallbackSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <Skeleton className="h-16 w-16 rounded-full mb-6" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-80 mb-2" />
        <Skeleton className="h-4 w-60" />
      </CardContent>
    </Card>
  </div>
);

// Main component that uses useSearchParams
const GoogleCallbackContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setError("No authorization code received from Google");
        setLoading(false);
        toast.error("Authentication failed: No code received from Google");
        setTimeout(() => router.push("/auth/signin"), 3000);
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

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error: any) {
        console.error("Google authentication error:", error);
        setError(error.message || "Failed to authenticate with Google");
        setLoading(false);
        toast.error(error.message || "Failed to authenticate with Google");
        setTimeout(() => router.push("/auth/signin"), 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
          {loading ? (
            <>
              <div className="relative mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
                </div>
              </div>
              
              <Badge variant="outline" className="mb-4 bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                <Shield className="h-3 w-3 mr-1" />
                Secure Authentication
              </Badge>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Completing Google Authentication
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Please wait while we securely authenticate your account and set up your session...
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Verifying credentials</span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <Badge variant="outline" className="mb-4 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                <XCircle className="h-3 w-3 mr-1" />
                Authentication Failed
              </Badge>
              
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Authentication Failed
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {error}
              </p>
              
              <div className="space-y-4 w-full">
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => router.push("/auth/signin")}
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
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                If the problem persists, please contact support for assistance.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Main page component with Suspense boundary
const GoogleCallback: React.FC = () => {
  return (
    <Suspense fallback={<GoogleCallbackSkeleton />}>
      <GoogleCallbackContent />
    </Suspense>
  );
};

export default GoogleCallback;
