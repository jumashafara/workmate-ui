"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { googleAuthenticate } from "@/api/auth";
import { setAuthToken, setRefreshToken, setUserData } from "@/utils/cookie";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const scope = searchParams.get("scope");

    // Ensure this runs only once and that we have a code
    if (code) {
      handleGoogleCallback(code, scope || "");
    } else {
      setError("Authorization code not found in URL.");
    }
  }, [searchParams]);

  const handleGoogleCallback = async (code: string, scope: string) => {
    try {
      const response = await googleAuthenticate(code, scope);

      if (response && response.access_token && response.user) {
        // Save tokens and user data
        setAuthToken(response.access_token);
        setRefreshToken(response.refresh_token);
        setUserData({
          email: response.user.email,
          full_name: response.user.full_name,
          username: response.user.username,
          role: response.user.role,
          region: response.user.region,
          district: response.user.district,
          superuser: response.user.is_superuser,
        });

        // Redirect to a protected route on success
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: any) {
      console.error("Google authentication failed:", err);
      setError(
        err.message || "An unexpected error occurred during Google authentication."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription className="text-center">
              {error}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold text-gray-700">
              Authenticating with Google...
            </p>
            <p className="text-sm text-gray-500">
              Please wait while we securely sign you in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
