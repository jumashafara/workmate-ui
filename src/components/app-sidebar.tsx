"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  MessageCircle,
  BarChart3,
  Brain,
  Home,
  DollarSign,
  Repeat,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  useSidebar,
} from "@/components/ui/sidebar";

// Navigation data generator based on user role
const getNavigationData = (userRole: string, isSuperuser: boolean) => {
  let groups: any[] = [];

  // Knowledge Management items are visible to all roles
  const knowledgeManagementItems = [
    {
      title: "Chatbot",
      url: "/chat",
      icon: MessageCircle,
    },
  ];

  if (isSuperuser) {
    groups = [
      {
        label: "Risk Assessment",
        items: [
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
        ],
      },
      {
        label: "Knowledge Management",
        items: knowledgeManagementItems,
      },
    ];
  } else if (userRole === "area_manager") {
    groups = [
      {
        label: "Risk Assessment",
        items: [
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
        ],
      },
      {
        label: "Knowledge Management",
        items: knowledgeManagementItems,
      },
    ];
  } else {
    // For staff or any other role
    groups = [
      {
        label: "Knowledge Management",
        items: knowledgeManagementItems,
      },
    ];
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
        plan: "VENN",
      },
    ],
    navMain: groups,
    projects: [],
  };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navigationData, setNavigationData] = useState<{
    teams: any[];
    navMain: any[];
    projects: any[];
  }>({ teams: [], navMain: [], projects: [] });
  const [userRole, setUserRole] = useState<string>("");
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);

  const { currency, toggleCurrency, exchangeRate } = useCurrency();
  const { state } = useSidebar();

  useEffect(() => {
    const userData = getUserData();
    const role = userData.role || "";
    const superuser = userData.superuser === true;

    setUserRole(role);
    setIsSuperuser(superuser);

    // Generate navigation based on user role
    const navData = getNavigationData(role, superuser);
    setNavigationData(navData);
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/">
          <SidebarMenuButton
            size="lg"
            className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
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
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">Workmate</span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded-sm">
                  BETA
                </span>
              </div>
              <span className="truncate text-xs">VENN</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navigationData.navMain} />
      </SidebarContent>

      <SidebarFooter>
        {state === "expanded" && (isSuperuser || userRole === "area_manager") && (
          <div className="flex flex-col gap-2 p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCurrency}
              className="flex items-center justify-center gap-2"
            >
              <Repeat className="h-4 w-4" />
              <span>Toggle to {currency === "USD" ? "UGX" : "USD"}</span>
            </Button>
            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
              1 USD = {exchangeRate.toLocaleString()} UGX
            </div>
          </div>
        )}
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
