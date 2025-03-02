import { PresenceSchema } from "@/app/(schema)/SchemaPresence";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const idUtilisateur = "cm7q0n4gp0000irv8pjkj764m";

  try {
    const evenement = await prisma.evenement.findUnique({
      where: { id },
      include: { equipe: true },
    });

    if (!evenement) {
      return NextResponse.json(
        { message: "Événement non trouvé" },
        { status: 404 }
      );
    }

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: evenement.equipeId,
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { message: "Vous n'êtes pas membre de cette équipe" },
        { status: 403 }
      );
    }

    const presences = await prisma.presence.findMany({
      where: {
        evenementId: id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        evenement: {
          select: {
            titre: true,
            typeEvenement: true,
            description: true,
            lieu: true,
          },
        },
      },
      orderBy: {
        dateCreation: "desc",
      },
    });

    const ReponsePresence = presences.map((presence) => ({
      ...presence.evenement,
      ...presence.user,
      statut: presence.statut,
    }));
    return NextResponse.json(ReponsePresence);
  } catch (error) {
    console.error("Erreur lors de la récupération des présences:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const idUtilisateur = "cm7q0n4gp0000irv8pjkj764m";

  try {
    const body = await req.json();
    const validationResult = PresenceSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    const evenement = await prisma.evenement.findUnique({
      where: { id },
      include: { equipe: true },
    });

    if (!evenement) {
      return NextResponse.json(
        { message: "Événement non trouvé" },
        { status: 404 }
      );
    }

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: evenement.equipeId,
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { message: "Vous n'êtes pas membre de cette équipe" },
        { status: 403 }
      );
    }

    let userId = idUtilisateur;

    if (data.userId && data.userId !== idUtilisateur) {
      if (membreEquipe.role !== "ENTRAINEUR") {
        return NextResponse.json(
          { message: "Vous ne pouvez indiquer que votre propre présence" },
          { status: 403 }
        );
      }

      const membreCible = await prisma.membreEquipe.findFirst({
        where: {
          userId: data.userId,
          equipeId: evenement.equipeId,
        },
      });

      if (!membreCible) {
        return NextResponse.json(
          { message: "L'utilisateur cible n'est pas membre de cette équipe" },
          { status: 404 }
        );
      }

      userId = data.userId;
    }

    const presenceExistante = await prisma.presence.findUnique({
      where: {
        userId_evenementId: {
          userId: userId,
          evenementId: id,
        },
      },
    });

    if (presenceExistante) {
      return NextResponse.json(
        {
          message:
            "Une présence existe déjà pour cet utilisateur et cet événement",
        },
        { status: 409 } // Conflict
      );
    }

    const presence = await prisma.presence.create({
      data: {
        userId: userId,
        evenementId: id,
        statut: data.statut,
      },
    });

    return NextResponse.json(presence, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de présence:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
