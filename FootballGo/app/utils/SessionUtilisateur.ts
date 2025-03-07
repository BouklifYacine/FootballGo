import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export async function SessionUtilisateur() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/connexion");
  }

  const SessionID = session?.user?.id;

  const utilisateur = await prisma.user.findUnique({
    where: { id: SessionID },
  });

  if (!utilisateur) redirect("/");

  return { utilisateur };
}
