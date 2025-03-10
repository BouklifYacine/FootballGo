import { GetSessionUtilisateur } from "@/app/utils/GetSessionUtilisateur";

export type RoleJoueurEquipetype = {
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

  if (!utilisateur) return null;

  const donnéesUtilisateur: RoleJoueurEquipetype = {
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
