import { CreationEquipeSchema } from "@/app/(schema)/SchemaEquipe";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id)
    return NextResponse.json(
      {
        message: "Vous devez etre connecté pour accéder a ces infos ",
      },
      { status: 400 }
    );

  const equipe = await prisma.equipe.findMany();

  if (equipe.length === 0)
    return NextResponse.json(
      {
        message: "Il n'y a pas d'équipe disponible",
      },
      { status: 400 }
    );

  return NextResponse.json(equipe);
}

export async function POST(request: NextRequest) {
  const { nom, logoUrl, description } = await request.json();

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

  const utilisateur = await prisma.user.findUnique({
    where: { id: idUtilisateur },
  });

  if (!utilisateur)
    return NextResponse.json(
      { message: "Utilisateur introuvable" },
      { status: 400 }
    );

  const nouvelleEquipe = await prisma.$transaction(async (tx) => {
    const equipe = await tx.equipe.create({
      data: {
        nom,
        logoUrl,
        description,
      },
    });

    await tx.membreEquipe.create({
      data: {
        userId: idUtilisateur,
        equipeId: equipe.id,
        role: "ENTRAINEUR",
      },
    });

    return equipe;
  });

  return NextResponse.json({
    message: "Équipe créée avec succès",
    equipe: nouvelleEquipe
  }, { status: 201 });

}
