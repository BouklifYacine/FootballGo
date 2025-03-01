import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { id: string; idutilisateurs: string };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id: equipeId, idutilisateurs: membreId } = await params;
  const idUtilisateurConnecte = "cm7py8xtm0000irp8jxz60bjv";

  try {
    const equipe = await prisma.equipe.findUnique({
      where: { id: equipeId },
    });

    if (!equipe) {
      return NextResponse.json(
        { message: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur connecté est soit l'utilisateur qui veut quitter, soit un coach
    if (idUtilisateurConnecte !== membreId) {
      const membreConnecte = await prisma.membreEquipe.findFirst({
        where: {
          userId: idUtilisateurConnecte,
          equipeId: equipeId,
          role: "ENTRAINEUR",
        },
      });

      if (!membreConnecte) {
        return NextResponse.json(
          {
            message: "Vous n'avez pas les droits pour effectuer cette action",
          },
          { status: 403 }
        );
      }
    }

    const membreASupprimer = await prisma.membreEquipe.findFirst({
      where: {
        userId: membreId,
        equipeId: equipeId,
      },
    });

    if (!membreASupprimer) {
      return NextResponse.json(
        { message: "L'utilisateur n'est pas membre de cette équipe" },
        { status: 404 }
      );
    }

    if (membreASupprimer.role === "ENTRAINEUR") {
      const nombreCoachs = await prisma.membreEquipe.count({
        where: {
          equipeId: equipeId,
          role: "ENTRAINEUR",
        },
      });

      if (nombreCoachs === 1) {
        return NextResponse.json(
          {
            message:
              "Vous êtes le dernier coach de l'équipe. Veuillez supprimer l'équipe plutôt que de la quitter.",
          },
          { status: 400 }
        );
      }
    }

  
    await prisma.$transaction(async (tx) => {
      // Supprimer les statistiques du joueur
      await tx.statistiqueJoueur.deleteMany({
        where: {
          userId: membreId,
          evenement: {
            equipeId: equipeId,
          },
        },
      });

      // Supprimer les présences du joueur
      await tx.presence.deleteMany({
        where: {
          userId: membreId,
          evenement: {
            equipeId: equipeId,
          },
        },
      });

      // Supprimer le membre de l'équipe
      await tx.membreEquipe.delete({
        where: {
          id: membreASupprimer.id,
        },
      });
    });

    return NextResponse.json({
      message: `L'utilisateur a quitté l'équipe ${equipe.nom} avec succès`,
    });
  } catch (error) {
    console.error("Erreur serveur lors de la suppression du membre", error);
    return NextResponse.json(
      { message: "Une erreur serveur est survenue" },
      { status: 500 }
    );
  }
}
