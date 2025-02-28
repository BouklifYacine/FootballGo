import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ChangementDonneeJoueur } from "@/app/(schema)/SchemaEquipe";

interface RouteParams {
  params: { id: string; membreid: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { role, posteJoueur } = await request.json();
  const { membreid, id } = await params; 
  const idUtilisateur = "cm7otaiad0000irmosgcw75q0";

  try {
    const validation = ChangementDonneeJoueur.safeParse({ role, posteJoueur });
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          erreurs: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const equipe = await prisma.equipe.findUnique({
      where: { id },
    });

    if (!equipe) {
      return NextResponse.json(
        { message: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    const joueurauclub = await prisma.membreEquipe.findUnique({
      where: { userId: membreid },
    });

    if (!joueurauclub) {
      return NextResponse.json(
        { message: "Ce joueur ne fait pas partie de ce club" },
        { status: 404 }
      );
    }

    const CoachEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: id,
        role: "ENTRAINEUR",
      },
    });

    if (!CoachEquipe) {
      return NextResponse.json(
        {
          message:
            "Seuls les coach de cette équipe peuvent modifier les données du club",
        },
        { status: 403 }
      );
    }

    const joueurmodifie = await prisma.membreEquipe.update({
      where: { id: joueurauclub.id },
      data: { role, posteJoueur },
    });

    return NextResponse.json({
      role: joueurmodifie.role,
      poste: joueurmodifie.posteJoueur,
    });
  } catch (error) {
    console.log(
      "erreur serveur lors du changement des données du joueur",
      error
    );
    return NextResponse.json(
      { message: "erreur serveur lors du changement des données du joueur" },
      { status: 500 }
    );
  }
}
