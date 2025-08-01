"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { MessageCircle, BarChart3, Brain, Home, DollarSign, Repeat } from "lucide-react";
import Image from "next/image";
import { getUserData } from "@/utils/cookie";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";

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
  let navItems: any[] = [];

  // Staff items are visible to all roles.
  const staffItems = [
    {
      title: "Chat",
      url: "/chat",
      icon: MessageCircle,
    },
  ];

  if (isSuperuser) {
    navItems = [
      {
        title: "Standard Evaluations",
        url: "#",
        icon: Home,
        isActive: true,
        items: [
          {
            title: "Aggregated Predictions",
            url: "/superuser/predictions",
          },
          {
            title: "Cluster Trends",
            url: "/superuser/trends",
          },
          
        ],
      },
      {
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
      },
      ...staffItems,
    ];
  } else if (userRole === "area_manager") {
    navItems = [
      {
        title: "Standard Evaluations",
        url: "#",
        icon: BarChart3,
        isActive: true,
        items: [
          {
            title: "Aggregated Predictions",
            url: "/area-manager/predictions",
          },
          {
            title: "Cluster Trends",
            url: "/area-manager/trends",
          },
        ],
      },
      ...staffItems,
    ];
  } else {
    // For staff or any other role
    navItems = staffItems;
  }

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
  
  const { currency, toggleCurrency, exchangeRate } = useCurrency();

  useEffect(() => {
    const userData = getUserData();
    const userRole = userData.role || "";
    const isSuperuser = userData.superuser === true;

    // Generate navigation based on user role
    const navData = getNavigationData(userRole, isSuperuser);
    setNavigationData(navData);
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className=" text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-lg transition-all group-data-[state=collapsed]:size-8">
            <Image
              src="/RTV_Logo.png"
              alt="RTV Logo"
              className="object-contain"
              width={64}
              height={64}
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
        <div className="flex flex-col gap-2 p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleCurrency}
            className="flex items-center justify-center gap-2"
          >
            <Repeat className="h-4 w-4" />
            <span>Toggle to {currency === 'USD' ? 'UGX' : 'USD'}</span>
          </Button>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            1 USD = {exchangeRate.toLocaleString()} UGX
          </div>
          <NavUser />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
