import { GetSessionUtilisateur } from "@/app/utils/GetSessionUtilisateur";

type RoleJoueurEquipe = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "utilisateur" | "Admin";
  plan: "free" | "pro";
  roleEquipe: "SANSCLUB" | "JOUEUR" | "ENTRAINEUR";
};

export async function RoleJoueurEquipe() {
  const utilisateur = await GetSessionUtilisateur();

  if (!utilisateur) return {error : "Pas connecté"};

  const donnéesUtilisateur: RoleJoueurEquipe = {
    id: utilisateur.id,
    name: utilisateur.name || "",
    email: utilisateur.email || "",
    avatar: utilisateur.image || "",
    role: utilisateur.role,
    plan: utilisateur.plan,
    roleEquipe: utilisateur.roleEquipe,
  };

  return donnéesUtilisateur;
}
