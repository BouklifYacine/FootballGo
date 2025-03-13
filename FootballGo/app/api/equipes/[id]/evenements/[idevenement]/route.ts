import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { prisma } from "@/prisma";

dayjs.locale("fr");

const idUtilisateur = "cm7q0n4gp0000irv8pjkj764m";



export async function GET(
  req: NextRequest,
  { params }: { params: { idEquipe: string; idevenement: string } }
) {
  try {
    const { idEquipe, idevenement } = await params;

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        equipeId: idEquipe,
        userId: idUtilisateur,
        role: { in: ["ENTRAINEUR", "JOUEUR"] },
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { error: "Vous n'êtes pas membre de cette équipe" },
        { status: 403 }
      );
    }

    const evenement = await prisma.evenement.findUnique({
      where: {
        id: idevenement,
        equipeId: idEquipe,
      },
      include: {
        presences: {
          where: { userId: idUtilisateur },
          select: { id: true, statut: true },
        },
      },
    });

    if (!evenement) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    const evenementFormate = {
      ...evenement,
      dateDebutFormatee: dayjs(evenement.dateDebut).format(
        "dddd D MMMM YYYY à HH:mm"
      ),
      maPresence: evenement.presences[0] || null,
    };

    return NextResponse.json(evenementFormate);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'événement" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { idEquipe: string; idevenement: string } }
) {
  try {
    const { idEquipe, idevenement } = params;

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        equipeId: idEquipe,
        userId: idUtilisateur,
        role: "ENTRAINEUR",
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cet événement" },
        { status: 403 }
      );
    }

    const evenement = await prisma.evenement.findUnique({
      where: {
        id: idevenement,
        equipeId: idEquipe,
      },
      select: { titre: true },
    });

    if (!evenement) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.presence.deleteMany({
        where: { evenementId: idevenement },
      });

      await tx.statistiqueJoueur.deleteMany({
        where: { evenementId: idevenement },
      });

      await tx.statistiqueEquipe.deleteMany({
        where: { evenementId: idevenement },
      });

      await tx.evenement.delete({
        where: { id: idevenement },
      });
    });

    return NextResponse.json({
      success: true,
      message: `L'événement "${evenement.titre}" a été supprimé avec succès`,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'événement" },
      { status: 500 }
    );
  }
}
