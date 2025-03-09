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
      url: "/dashboard",
      icon: HomeIcon,
      isActive: true,
      items: [
        {
          title: "Vue d'ensemble",
          url: "/dashboard/overview",
        },
      ],
    },
    {
      title: "Équipes",
      url: "/equipes",
      icon: UsersIcon,
      items: [
        {
          title: "Liste des équipes",
          url: "/equipes/liste",
        },
        {
          title: "Classements",
          url: "/equipes/classements",
        },
        {
          title: "Performance",
          url: "/equipes/performance",
        },
      ],
    },
    {
      title: "Événements",
      url: "/evenements",
      icon: CalendarIcon,
      items: [
        {
          title: "Matchs à venir",
          url: "/evenements/matchs",
        },
        {
          title: "Entrainements à venir ",
          url: "/evenements/tournois",
        },
      ],
    },
    {
      title: "Gestion d'équipe",
      url: "/membres",
      icon: UsersIcon,
      items: [
        {
          title: "Joueurs",
          url: "/membres/joueurs",
        },
        {
          title: "Staff",
          url: "/membres/staff",
        },
      ],
    },
    {
      title: "Présences",
      url: "/presence",
      icon: ClipboardCheckIcon,
      items: [
        {
          title: "Entraînements",
          url: "/presence/entrainements",
        },
        {
          title: "Matchs",
          url: "/presence/matchs",
        },
      ],
    },
    {
      title: "Statistiques",
      url: "/statistiques",
      icon: BarChart2Icon,
      items: [
        {
          title: "Statistiques perso",
          url: "/statistiques/perso",
        },
        {
          title: "Statistiques équipes",
          url: "/statistiques/equipes",
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