

import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function GetSessionUtilisateur() {
  try {
    const session = await auth();

    const SessionID = session?.user?.id;

    if (!SessionID) {
      return null;
    }

    const utilisateur = await prisma.user.findUnique({
      where: { id: SessionID },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role : true,
        plan : true,
        roleEquipe : true 
      },
    });

    return utilisateur;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}
