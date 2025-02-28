import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  const idUtilisateur = "cm7otmoce0002irmoe5qxpl6x";
 
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
        membres: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
               
               
              }
            }
          }
        },
      },
    });

    return NextResponse.json({ListeEquipe : equipeComplete?.membres});
  } catch (error) {
    console.error("Erreur lors de la recherche d'équipe:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}