"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  BarChart3, 
  Brain
} from "lucide-react";
import Image from "next/image";
import { getUserData } from "@/utils/ccokie";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

// Navigation data generator based on user role
const getNavigationData = (userRole: string, isSuperuser: boolean) => {
  const navItems = [];

  // Dashboard section - accessible to all authenticated users
  const dashboardItems = [];
  
  // Predictions Dashboard - all roles get access
  dashboardItems.push({
    title: "Predictions Dashboard",
    url: "/dashboard",
  });
  
  // Predictions Trends - Superuser and Area Manager only
  if (isSuperuser || userRole === "area_manager") {
    dashboardItems.push({
      title: "Predictions Trends", 
      url: "/cluster-trends",
    });
  }
  
  // Check-in Evaluations - Superuser only
  if (isSuperuser) {
    dashboardItems.push({
      title: "Check-in Evaluations",
      url: "/checkin-evaluations",
    });
  }
  
  navItems.push({
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    isActive: true,
    items: dashboardItems,
  });
  
  // Model Interpretability section - Superuser only
  if (isSuperuser) {
    navItems.push({
      title: "Model Interpretability",
      url: "/model-metrics",
      icon: Brain,
      items: [
        {
          title: "Model Metrics",
          url: "/model-metrics",
        },
        {
          title: "Feature Importance",
          url: "/feature-importance",
        },
        {
          title: "Individual Predictions",
          url: "/individual-predictions",
        },
      ],
    });
  }
  
  // Chat section - accessible to all authenticated users
  navItems.push({
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  });
  
  // Settings section (commented out in frontend, but included for completeness)
  // if (isSuperuser) {
  //   navItems.push({
  //     title: "Settings",
  //     url: "/settings",
  //     icon: SettingsIcon,
  //   });
  // }
  
  return {
    teams: [
      {
        name: "Workmate",
        logo: () => (
          <div className="relative h-8 w-8">
            <Image
              src="/RTV_Logo.png"
              alt="RTV Logo"
              fill
              className="object-contain"
            />
          </div>
        ),
        plan: "Analytics",
      },
    ],
    navMain: navItems,
    projects: [],
  };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navigationData, setNavigationData] = useState<{
    teams: any[];
    navMain: any[];
    projects: any[];
  }>({ teams: [], navMain: [], projects: [] });
  
  useEffect(() => {
    const userData = getUserData();
    const userRole = userData.role || "";
    const isSuperuser = Boolean(userData.superuser) || userData.superuser === "true";
    
    // Generate navigation based on user role
    const navData = getNavigationData(userRole, isSuperuser);
    setNavigationData(navData);
  }, []);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              src="/RTV_Logo.png"
              alt="RTV Logo"
              className="object-contain"
              width={50}
              height={50}
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Workmate App</span>
            <span className="truncate text-xs">Analytics</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
