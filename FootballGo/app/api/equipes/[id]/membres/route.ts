// app/api/equipes/[id]/membres/route.ts
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifierEquipeEtMembre } from "../../../../(middleware)/VérifierEquipeetMembreEquipe";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idUtilisateur = "cm7q0n4gp0000irv8pjkj764m";

  const { error } = await verifierEquipeEtMembre(id , idUtilisateur);

  if (error) {
    return error;
  }

  try {
    const equipeComplete = await prisma.equipe.findUnique({
      where: { id },
      include: {
        membres: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ ListeEquipe: equipeComplete?.membres });
  } catch (error) {
    console.error("Erreur lors de la recherche d'équipe:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
