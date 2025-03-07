
import { GetSessionUtilisateur } from "@/app/utils/GetSessionUtilisateur";
import { SidebarClient } from "@/components/sidebar-client";
interface SidebarServeurProps {
  className?: string;
}

export async function SidebarServeur({ className, ...props }: SidebarServeurProps) {
  const utilisateur = await GetSessionUtilisateur();
  
  if (!utilisateur) {

    return <SidebarClient 
      userData={{
        name: "Invité",
        email: "",
        avatar: "/avatars/default.jpg",
      }}
      className={className} 
      {...props} 
    />;
  }
  
  const donnéesUtilisateur = {
    id: utilisateur.id,
    name: utilisateur.name || "Utilisateur",
    email: utilisateur.email || "",
    avatar: utilisateur.image || "/avatars/default.jpg",
    role: utilisateur.role || "utilisateur",
    plan: utilisateur.plan || "free"
  };
  
  return <SidebarClient 
    userData={donnéesUtilisateur}  className={className}  {...props} 
  />;
}