"use client";

import * as React from "react";
import {
  BarChart2Icon,
  CalendarIcon,
  ClipboardCheckIcon,
  GalleryVerticalEnd,
  HomeIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

interface UserData {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
  plan?: string;
  roleEquipe?: string;
}

interface SidebarClientProps extends React.ComponentProps<typeof Sidebar> {
  userData: UserData;
}

export function SidebarClient({ userData, ...props }: SidebarClientProps) {
  const aUnClub = userData.roleEquipe !== "SANSCLUB";

  const elementsNavigationBase = [
    {
      title: "Accueil",
      url: "/dashboardclient",
      icon: HomeIcon,
      isActive: true,
      items: [
        {
          title: "Vue d'ensemble",
          url: "/dashboardclient",
        },
      ],
    },
    {
      title: "Équipes",
      url: "/dashboardclient/equipe",
      icon: UsersIcon,
      items: [
        {
          title: "Détails de mon équipe",
          url: "/dashboardclient/equipe/cm7otmoce0002irmoe5qxpl6x",
        },
        {
          title: "Performance",
          url: "/dashboardclient/equipe/performance",
        },
      ],
    },
    {
      title: "Événements",
      url: "/dashboardclient/evenements",
      icon: CalendarIcon,
      items: [
        {
          title: "Matchs à venir",
          url: "/dashboardclient/evenements/matchs",
        },
        {
          title: "Entrainements à venir ",
          url: "/dashboardclient/evenements/entrainements",
        },
      ],
    },
    {
      title: "Gestion d'équipe",
      url: "/dashboardclient/membres",
      icon: UsersIcon,
      items: [
        {
          title: "Joueurs",
          url: "/dashboardclient/membres/joueurs",
        },
        {
          title: "Staff",
          url: "/dashboardclient/membres/staff",
        },
      ],
    },
    {
      title: "Présences",
      url: "/dashboardclient/presence",
      icon: ClipboardCheckIcon,
      items: [
        {
          title: "Entraînements",
          url: "/dashboardclient/presence/entrainements",
        },
        {
          title: "Matchs",
          url: "/dashboardclient/presence/matchs",
        },
      ],
    },
    {
      title: "Statistiques",
      url: "/dashboardclient/statistiques",
      icon: BarChart2Icon,
      items: [
        {
          title: "Statistiques perso",
          url: "/dashboardclient/statistiques/perso",
        },
        {
          title: "Statistiques équipes",
          url: "/dashboardclient/statistiques/equipes",
        },
      ],
    },
  ];


  const elementsNavigationFiltrés = aUnClub  ? elementsNavigationBase  : elementsNavigationBase.filter(item => item.title === "Accueil");

  const data = {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      role: userData.role,
      plan: userData.plan,
    },
    teams: [
      {
        name: "FootballGo",
        logo: GalleryVerticalEnd,
        plan: userData.plan?.toLocaleUpperCase() || ""
      },
    
    ],
    navMain: elementsNavigationFiltrés,  
  };
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
         <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}