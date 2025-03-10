import { RoleJoueurEquipe } from "@/lib/RoleJoueurEquipe";
import InputCodeInvitation from "./(components)/InputCodeInvitation";
import ClientStats from "./(components)/client-stats";

export default async function DashboardPage() {
  const utilisateur = await RoleJoueurEquipe();

  return (
    <>
      <InputCodeInvitation utilisateur={utilisateur} />
      <ClientStats />
    </>
  );
}