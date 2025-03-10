import { GetSessionUtilisateur } from "@/app/utils/GetSessionUtilisateur";
import { SidebarClient } from "@/components/sidebar-client";
import { prisma } from "@/prisma";

interface SidebarServeurProps {
  className?: string;
}

export async function SidebarServeur({
  className,
  ...props
}: SidebarServeurProps) {
  const utilisateur = await GetSessionUtilisateur();

  if (!utilisateur) {
    return (
      <SidebarClient
        userData={{
          name: "Invité",
          email: "",
          avatar: "/avatars/default.jpg",
        }}
        equipeData={null}
        className={className}
        {...props}
      />
    );
  }

  let equipeData = null;

  try {
    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: { userId: utilisateur.id },
      include: { equipe: true },
    });

    if (membreEquipe) {
      equipeData = {
        id: membreEquipe.equipe.id,
        nom: membreEquipe.equipe.nom,
        logoUrl: membreEquipe.equipe.logoUrl || "/logos/default-team.png",
        role: membreEquipe.role,
        posteJoueur: membreEquipe.posteJoueur || null,
      };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe:", error);
  }

  const donnéesUtilisateur = {
    id: utilisateur.id,
    name: utilisateur.name || "Utilisateur",
    email: utilisateur.email || "",
    avatar: utilisateur.image || "/avatars/default.jpg",
    role: utilisateur.role || "utilisateur",
    plan: utilisateur.plan || "free",
    roleEquipe: utilisateur.roleEquipe || "SANSCLUB",
  };

  return (
    <SidebarClient
      userData={donnéesUtilisateur}
      equipeData={equipeData}
      className={className}
      {...props}
    />
  );
}
