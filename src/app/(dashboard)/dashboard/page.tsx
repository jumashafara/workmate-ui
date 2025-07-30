"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/utils/ccokie";

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
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
}
