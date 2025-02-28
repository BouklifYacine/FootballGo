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
  
    const idUtilisateur = "cm7oz4qau0000irj0fl31bdp9";
  
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
  
    try {

      const utilisateur = await prisma.user.findUnique({
        where: { id: idUtilisateur },
      });
  
      if (!utilisateur)
        return NextResponse.json(
          { message: "Utilisateur introuvable" },
          { status: 400 }
        );
  
      const equipeExistante = await prisma.equipe.findFirst({
        where: {
          nom: {
            mode: 'insensitive',
            equals: nom.trim()
          }
        }
      });
      
      if (equipeExistante) {
        return NextResponse.json(
          { message: "Une équipe avec ce nom existe déjà" },
          { status: 409 }
        );
      }
  
      const dejaEntraineur = await prisma.membreEquipe.findFirst({
        where: {
          userId: idUtilisateur,
          role: "ENTRAINEUR"
        }
      });
  
      if (dejaEntraineur) {
        return NextResponse.json(
          { message: "Vous êtes déjà entraîneur d'une équipe" },
          { status: 409 }
        );
      }
  
      const nouvelleEquipe = await prisma.$transaction(async (tx) => {
        const equipe = await tx.equipe.create({
          data: {
            nom: nom.trim(),
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
      
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe:", error);
      return NextResponse.json(
        { message: "Erreur lors de la création de l'équipe" },
        { status: 500 }
      );
    }
  }
