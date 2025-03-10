import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { CreationEquipeSchema } from "@/app/(schema)/SchemaEquipe";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params; 
  const session = await auth();
  const idUtilisateur = session?.user?.id;
  
  console.log("ID d'équipe reçu:", id);
  console.log("ID d'utilisateur:", idUtilisateur);

  try {
    // Vérifier que l'équipe existe
    const equipe = await prisma.equipe.findUnique({
      where: { id },
    });

    if (!equipe) {
      console.log("Équipe non trouvée:", id);
      return NextResponse.json(
        { message: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    if (!idUtilisateur) {
      return NextResponse.json(
        { message: "Authentification requise" },
        { status: 401 }
      );
    }

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: id,
      },
    });

    if (!membreEquipe) {
      console.log("Utilisateur non membre de l'équipe");
      return NextResponse.json(
        {
          message: "Seuls les membres de cette équipe peuvent accéder à ces données",
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

    return NextResponse.json({ ListeEquipe: equipeComplete });
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
  const idUtilisateur = "cm7q0n4gp0000irv8pjkj764m";

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

  const nomequipe = equipe.nom;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: idUtilisateur },
      data: {
        roleEquipe: "SANSCLUB",
        AunClub: "NON",
      },
    });

    await tx.equipe.delete({
      where: { id },
    });
  });

  return NextResponse.json(
    {
      nomequipe,
      message: `L'équipe ${nomequipe} a bien été supprimé`,
    },
    { status: 200 }
  );
}
