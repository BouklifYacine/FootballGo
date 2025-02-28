import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const idUtilisateur = "cm7ojx8uk0000ir5o5gd422s";

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
