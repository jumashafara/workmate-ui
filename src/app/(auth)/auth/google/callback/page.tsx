import { Suspense } from "react";
import { GoogleCallbackContent } from "./_components/google-callback";
import { GoogleCallbackSkeleton } from "./_components/google-callback-skeleton";

export default function GoogleCallback() {
  return (
    <Suspense fallback={<GoogleCallbackSkeleton />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
