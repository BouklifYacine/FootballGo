"use client";

import * as React from "react";
import {
  AudioWaveform,
  BarChart2Icon,
  CalendarIcon,
  ClipboardCheckIcon,
  Command,
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

// Type pour les données utilisateur
interface UserData {
  name: string;
  email: string;
  avatar: string;
}

// Props pour le composant client
interface SidebarClientProps extends React.ComponentProps<typeof Sidebar> {
  userData: UserData;
}

export function SidebarClient({ userData, ...props }: SidebarClientProps) {
  // Données avec les informations de l'utilisateur obtenues via Prisma
  const data = {
    user: {
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar, // Image de l'utilisateur de Prisma
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
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
        title: "Statisiques",
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
    ],
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