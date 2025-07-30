"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Map of route segments to display names
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  superuser: "Superuser",
  predictions: "Predictions Dashboard",
  trends: "Predictions Trends",
  reports: "Reports",
  checkins: "Check-in Evaluations",
  "model-metrics": "Model Metrics",
  "feature-importance": "Feature Importance",
  "individual-predictions": "Individual Predictions",
  "area-manager": "Area Manager",
  chat: "Chat",
};

export const BreadcrumbNav = () => {
  const pathname = usePathname();

  // Split pathname and filter out empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Remove the first segment if it's just a route group or empty
  const pathSegments = segments.filter(
    (segment) => !segment.startsWith("(") || !segment.endsWith(")")
  );

  // For dashboard root, show just "Dashboard"
  if (pathSegments.length <= 1 && pathSegments[0] === "dashboard") {
    return (
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <span className="font-medium text-foreground whitespace-nowrap">
          Dashboard
        </span>
      </div>
    );
  }

  const generateBreadcrumbs = () => {
    const breadcrumbs = [];

    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      href: "/dashboard",
      isLast: false,
    });

    // Build cumulative path for each segment
    let cumulativePath = "";
    let foundId = false;

    pathSegments.forEach((segment, index) => {
      cumulativePath += `/${segment}`;

      // Check if it's an ID (contains numbers or is a UUID pattern)
      const isId =
        /^[0-9]+$/.test(segment) ||
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          segment
        ) ||
        /^[a-zA-Z0-9]{20,}$/.test(segment); // Also catch long alphanumeric IDs

      if (isId) {
        foundId = true;
        return; // Skip adding this segment and stop processing further
      }

      // If we found an ID previously, don't add any more segments
      if (foundId) {
        return;
      }

      const label =
        routeLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      // Check if the next segment is an ID to determine if this is the last meaningful segment
      const nextSegment = pathSegments[index + 1];
      const nextIsId =
        nextSegment &&
        (/^[0-9]+$/.test(nextSegment) ||
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            nextSegment
          ) ||
          /^[a-zA-Z0-9]{20,}$/.test(nextSegment));

      breadcrumbs.push({
        label,
        href: cumulativePath,
        isLast: nextIsId || index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {breadcrumb.isLast ? (
            <span className="font-medium text-foreground whitespace-nowrap">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              {breadcrumb.label}
            </Link>
          )}
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
};
