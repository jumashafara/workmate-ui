"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getUserData } from "@/utils/cookie";

export default function DashboardRedirector() {
  const router = useRouter();

  useEffect(() => {
    const userData = getUserData();
    const userRole = userData.role || "";
    const isSuperuser = userData.superuser === true;

    if (isSuperuser) {
      router.replace("/superuser/predictions");
    } else if (userRole === "area_manager") {
      router.replace("/area-manager/predictions");
    } else {
      router.replace("/chat");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="text-lg font-medium text-gray-700">Redirecting...</p>
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-orange-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
