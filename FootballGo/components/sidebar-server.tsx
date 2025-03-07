

import { GetSessionUtilisateur } from "@/app/utils/GetSessionUtilisateur";
import { SidebarClient } from "@/components/sidebar-client";

// Props pour les propriétés de la sidebar
interface SidebarServeurProps {
  className?: string;
  // Ajoutez d'autres props si nécessaire
}

// Composant serveur qui récupère les données et les passe au client
export async function SidebarServeur({ className, ...props }: SidebarServeurProps) {
  // Récupérer les données utilisateur avec votre fonction
  const utilisateur = await GetSessionUtilisateur();
  
  // Préparer les données utilisateur pour le composant client
  const donnéesUtilisateur = {
    name: utilisateur?.name || "Utilisateur",
    email: utilisateur?.email || "",
    avatar: utilisateur?.image || "/avatars/default.jpg",
  };
  
  // Passer les données au composant client
  return <SidebarClient userData={donnéesUtilisateur} className={className} {...props} />;
}