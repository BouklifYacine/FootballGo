import { UpdatePresenceSchema } from "@/app/(schema)/SchemaPresence";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";




export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  const { id, userId } = await params;
  const idUtilisateur = "cm7q0n4gp0000irv8pjkj764m"; 

  try {
   
    const body = await req.json();
    const validationResult = UpdatePresenceSchema.safeParse(body);

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

    if (userId !== idUtilisateur && membreEquipe.role !== "ENTRAINEUR") {
      return NextResponse.json(
        { message: "Vous ne pouvez modifier que votre propre présence" },
        { status: 403 }
      );
    }

    const presenceExistante = await prisma.presence.findUnique({
      where: {
        userId_evenementId: {
          userId: userId,
          evenementId: id,
        },
      },
    });

    if (!presenceExistante) {
      return NextResponse.json(
        { message: "Présence non trouvée" },
        { status: 404 }
      );
    }

    const presence = await prisma.presence.update({
      where: {
        userId_evenementId: {
          userId: userId,
          evenementId: id,
        },
      },
      data: {
        statut: data.statut,
      },
    });

    return NextResponse.json({Status : presence.statut, 
        DatePresence : presence.dateCreation
    }, {status : 200});
  } catch (error) {
    console.error("Erreur lors de la mise à jour de présence:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  const { id, userId } = await params;
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

    if (userId !== idUtilisateur && membreEquipe.role !== "ENTRAINEUR") {
      return NextResponse.json(
        { message: "Vous ne pouvez supprimer que votre propre présence" },
        { status: 403 }
      );
    }

    const presenceExistante = await prisma.presence.findUnique({
      where: {
        userId_evenementId: {
          userId: userId,
          evenementId: id,
        },
      },
    });

    if (!presenceExistante) {
      return NextResponse.json(
        { message: "Présence non trouvée" },
        { status: 404 }
      );
    }

    await prisma.presence.delete({
      where: {
        userId_evenementId: {
          userId: userId,
          evenementId: id,
        },
      },
    });

    return NextResponse.json(
      { message: "Présence supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de présence:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
