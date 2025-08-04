"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { googleAuthenticate } from "@/api/auth";
import { setAuthToken, setRefreshToken, setUserData } from "@/utils/cookie";

function GoogleCallbackContent() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          setError(`Google authentication failed: ${error}`);
          setIsProcessing(false);
          return;
        }

        if (!code) {
          setError("No authorization code received from Google");
          setIsProcessing(false);
          return;
        }

        // Process the Google authentication
        const response = await googleAuthenticate(code);

        // Save the tokens and user data
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

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err: any) {
        console.error("Google authentication error:", err);
        setError(err.message || "Google authentication failed");
        setIsProcessing(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Google Authentication
          </h2>
          <p className="text-gray-600">Please wait while we complete your sign-in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Authentication Failed
            </h2>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => router.push("/sign-in")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
} 