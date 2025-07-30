"use client";

import * as React from "react";
import { MessageCircle, Shield } from "lucide-react";
import Image from "next/image";

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

const data = {
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
  navMain: [
    {
      title: "Risk assessment",
      url: "/dashboard",
      icon: Shield, // use a string if your icon system supports it, or import a better icon below
      isActive: true,
      items: [
        {
          title: "Predictions Dashboard",
          url: "/superuser/predictions",
        },
        {
          title: "Cluster Trends",
          url: "/superuser/trends",
        },
      ],
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageCircle,
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
