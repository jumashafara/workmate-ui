"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleAuthenticate } from "@/lib/api/auth";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Shield } from "lucide-react";
import { setAuthToken, setRefreshToken, setUserData } from "@/utils/cookie";

function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="relative">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <div className="absolute -top-1 -right-1">
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">
                Initializing Authentication
              </h1>
              <p className="text-muted-foreground">
                Setting up secure connection...
              </p>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {loading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" />
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold">
                  Completing Google Authentication
                </h1>
                <p className="text-muted-foreground">
                  Please wait while we authenticate your account...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-destructive">
                  Authentication Failed
                </h1>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Try signing in again or contact support if the problem
                  persists.
                </p>
              </div>
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
