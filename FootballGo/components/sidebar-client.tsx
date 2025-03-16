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

interface EquipeData {
  id: string;
  nom: string;
  logoUrl: string;
  role: string;
  posteJoueur: string | null;
}

interface SidebarClientProps extends React.ComponentProps<typeof Sidebar> {
  userData: UserData;
  equipeData: EquipeData | null;
}

export function SidebarClient({ userData, equipeData, ...props }: SidebarClientProps) {
  const aUnClub = userData.roleEquipe !== "SANSCLUB" && equipeData !== null;
  const estEntraineur = equipeData?.role === "ENTRAINEUR";

  const elementsNavigationBase = [
    {
      title: "Accueil",
      url: "/dashboard",
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
      url: "/equipes",
      icon: UsersIcon,
      items: [
        {
          title: "Détails Equipe",
          url: `/dashboardclient/equipe/${equipeData?.id}`,
        },
      
      ],
    },
    {
      title: "Événements",
      url: `/dashboardclient/evenements/${equipeData?.id}`, 
      icon: CalendarIcon,
      items: [
        {
          title: "Evenements",
          url: `/dashboardclient/evenements/${equipeData?.id}`,
        },
        {
          title: "Matchs à venir",
          url: "/evenements/matchs",
        },
        {
          title: "Entrainements à venir",
          url: "/evenements/tournois",
        },
      ],
    },
    {
      title: "Gestion d'équipe",
      url: "/membres",
      icon: UsersIcon,
      visible: estEntraineur, 
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
      url: "/presence",
      icon: ClipboardCheckIcon,
      items: [
        {
          title: "Mes présences",
          url: "/dashboardclient/mes-presences",
        },
        {
          title: "Toutes les présences",
          url: "/dashboardclient/presences",
          visible: estEntraineur, 
        },
      ],
    },
    {
      title: "Statistiques",
      url: "/statistiques",
      icon: BarChart2Icon,
      items: [
        {
          title: "Mes statistiques",
          url: "/dashboardclient/statistiquesjoueur",
        },
        {
          title: "Statistiques équipe",
          url: "/dashboardclient/statistiquesequipe",
        },
      ],
    },
  ];


  const elementsNavigationFiltrés = aUnClub
    ? elementsNavigationBase.filter(item => !item.hasOwnProperty('visible') || item.visible !== false)
    : elementsNavigationBase.filter(item => item.title === "Accueil");

 
  const elementsAvecSousMenusFiltrés = elementsNavigationFiltrés.map(item => ({
    ...item,
    items: item.items ? item.items.filter(subItem => !subItem.hasOwnProperty('visible') || subItem.visible !== false) : []
  }));

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
        name:  "FootballGo",
        logo: GalleryVerticalEnd,
        plan: userData.plan?.toLocaleUpperCase() || ""
      },
    ],
    navMain: elementsAvecSousMenusFiltrés,
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