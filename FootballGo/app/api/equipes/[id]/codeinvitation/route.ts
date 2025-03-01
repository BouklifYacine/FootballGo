import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idUtilisateur = "cm7oz4qau0000irj0fl31bdp9";

  try {
    const equipe = await prisma.equipe.findUnique({
      where: { id },
    });

    if (!equipe) {
      return NextResponse.json(
        { message: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: id,
        role: "ENTRAINEUR",
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        {
          message:
            "Seuls les coachs de cette équipe peuvent accéder à cette ressource",
        },
        { status: 403 }
      );
    }

    if (equipe.codeInvitation) {
      return NextResponse.json({
        message: `Code d'invitation existant pour l'équipe ${equipe.nom}`,
        codeInvitation: equipe.codeInvitation,
      });
    } else {
      const codeInvitation = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      await prisma.equipe.update({
        where: { id },
        data: { codeInvitation: codeInvitation },
      });

      return NextResponse.json({
        message: `Le code d'invitation pour l'équipe ${equipe.nom} a été créé`,
        codeInvitation: codeInvitation,
      });
    }
  } catch (error) {
    console.error(
      "Erreur serveur lors de la récupération du code d'invitation",
      error
    );
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idUtilisateur = "cm7py8xtm0000irp8jxz60bjv";
  try {
    const { codeInvitation } = await request.json();

    if (!codeInvitation) {
      return NextResponse.json(
        { message: "Le code d'invitation est requis" },
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

    if (equipe.codeInvitation !== codeInvitation)
      return NextResponse.json(
        { message: "Code d'invitation invalide" },
        { status: 400 }
      );

    const membreExistant = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: id,
      },
    });

    if (membreExistant) {
      return NextResponse.json(
        {
          message: "Vous etes déja dans ce club ",
        },
        { status: 403 }
      );
    }
    const nouveaumembre = await prisma.membreEquipe.create({
      data: {
        equipeId: id,
        userId: idUtilisateur,
        role: "JOUEUR",
      },
    });

    return NextResponse.json(
      {
        message: `Vous avez rejoins l'équipe ${equipe.nom}.`,
        membre: nouveaumembre,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Une erreur serveur sur la validation du code d'invitation ",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idUtilisateur = "cm7oz4qau0000irj0fl31bdp9";

  try {
    const equipe = await prisma.equipe.findUnique({
      where: { id },
    });

    if (!equipe) {
      return NextResponse.json(
        { message: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: id,
        role: "ENTRAINEUR",
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        {
          message:
            "Seuls les coachs de cette équipe peuvent accéder à cette ressource",
        },
        { status: 403 }
      );
    }

    if (!equipe.codeInvitation)
      return NextResponse.json({
        message: `Code d'invitation inexistant pour l'équipe ${equipe.nom}`,
      });

    await prisma.equipe.update({
      where: { id },
      data: { codeInvitation: null },
    });

    return NextResponse.json({
      message: `Code d'invitation de l'équipe ${equipe.nom} supprimé`,
    });
  } catch (error) {
    console.error(
      "Erreur serveur lors de la récupération du code d'invitation",
      error
    );
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
