import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export async function ProtectionRouteAvecSession() {
  const session = await auth();

  const SessionID = session?.user?.id;
  
  if (!session || !SessionID) {
    redirect("/connexion");
  }

  const utilisateur = await prisma.user.findUnique({
    where: { id: SessionID },
  });

  if (!utilisateur) redirect("/");

  const infosuser = {
    id: utilisateur.id,
    nom: utilisateur.name,
    email: utilisateur.email,
    avatar: utilisateur.image,
  };

  return { infosuser };
}
