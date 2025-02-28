import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { CreationEquipeSchema } from "@/app/(schema)/SchemaEquipe";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const idUtilisateur = "cm7ojx8uk0000ir5o5gd422sr";

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
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        {
          message:
            "Seuls les membres de cette équipe peuvent accéder à ces données",
        },
        { status: 403 }
      );
    }

    const equipeComplete = await prisma.equipe.findUnique({
      where: { id },
      include: {
        membres: true,
      },
    });

    return NextResponse.json(equipeComplete);
  } catch (error) {
    console.error("Erreur lors de la recherche d'équipe:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { nom, logoUrl, description } = await request.json();
    const { id } = await params;
    const idUtilisateur = "cm7ojx8uk0000ir5o5gd422sr";

    const validation = CreationEquipeSchema.safeParse({
      nom,
      logoUrl,
      description,
    });

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
            "Seuls les coach de cette équipe peuvent modifier les données du club",
        },
        { status: 403 }
      );
    }

    const nouvelledonnesEquipe = await prisma.equipe.update({
      where: { id },
      data: {
        nom: nom,
        description: description,
        logoUrl: logoUrl,
      },
    });

    return NextResponse.json(
      { message: "Changements effectué", nouvelledonnesEquipe },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Erreur lors de la modification des infos de votre équipe ",
      error
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const idUtilisateur = "cm7ojx8uk0000ir5o5gd422sr";

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
          "Seuls les coach de cette équipe peuvent modifier les données du club",
      },
      { status: 403 }
    );
  }

  const equipeSupprimer = await prisma.equipe.delete({
    where: { id: id },
  });

  return NextResponse.json(
    {
      nomequipe: equipeSupprimer.nom,
      message: `L'équipe ${equipeSupprimer.nom} a bien été supprimé`,
    },
    { status: 200 }
  );
}
