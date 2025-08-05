"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleAuthenticate } from "@/api/auth";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { setAuthToken, setRefreshToken, setUserData } from "@/utils/cookie";

const GoogleCallback: React.FC = () => {
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

        // Redirect to home page
        router.push("/");
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-6"></div>
              <h1 className="text-2xl font-semibold mb-4">
                Completing Google Authentication
              </h1>
              <p className="text-muted-foreground">
                Please wait while we authenticate your account...
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-destructive mb-4">
                Authentication Failed
              </h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="text-sm text-muted-foreground">
                Try signing in again or contact support if the problem persists.
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;
