import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { id: string; idutilisateurs: string };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id: equipeId, idutilisateurs: membreId } = await params;
  const idUtilisateurConnecte = "cm7q0n4gp0000irv8pjkj764m";

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

    // Vérifier les permissions
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
      include: {
        user: {
          select: { name: true }
        }
      }
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

    const nomUtilisateur = membreASupprimer.user?.name || "L'utilisateur";
  
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: membreId },
        data: {
          roleEquipe: "SANSCLUB",
          AunClub: "NON",
        },
      });

      await tx.statistiqueJoueur.deleteMany({
        where: {
          userId: membreId,
          evenement: {
            equipeId: equipeId,
          },
        },
      });

      await tx.presence.deleteMany({
        where: {
          userId: membreId,
          evenement: {
            equipeId: equipeId,
          },
        },
      });

      await tx.membreEquipe.delete({
        where: {
          id: membreASupprimer.id,
        },
      });
    });

    return NextResponse.json({
      message: `${nomUtilisateur} a quitté l'équipe ${equipe.nom} avec succès`,
    });
  } catch (error) {
    console.error("Erreur serveur lors de la suppression du membre", error);
    return NextResponse.json(
      { message: "Une erreur serveur est survenue" },
      { status: 500 }
    );
  }
}