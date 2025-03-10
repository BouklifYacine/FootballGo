import { RoleJoueurEquipe } from "@/lib/RoleJoueurEquipe";
import ClientStats from "./components/client-stats";
import InputCodeInvitation from "./components/InputCodeInvitation";

export default async function DashboardPage() {
  const utilisateur = await RoleJoueurEquipe();

  return (
    <>
      <InputCodeInvitation utilisateur={utilisateur} />
      <ClientStats />
    </>
  );
}