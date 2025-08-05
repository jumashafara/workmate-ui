"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperuserPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/superuser/predictions");
  }, [router]);

  return null;
}