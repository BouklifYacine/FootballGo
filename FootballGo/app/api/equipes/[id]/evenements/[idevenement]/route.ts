import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import "dayjs/locale/fr"; 
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/prisma";

dayjs.locale("fr");

const idUtilisateur = "cm7q0n4gp0000irv8pjkj764m";


const updateEvenementSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").optional(),
  description: z.string().optional().nullable(),
  lieu: z.string().optional().nullable(),
  typeEvenement: z.enum(["MATCH", "ENTRAINEMENT"]).optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Format de date invalide"
  }).optional(),
  heure: z.string().regex(/^\d{1,2}:\d{2}$/, "Format d'heure invalide (HH:MM)").optional(),
});

async function evenementExisteDejaALaMemeHeure(
  equipeId: string, 
  dateDebut: Date,
  evenementId: string,
  typeEvenement?: "MATCH" | "ENTRAINEMENT"
): Promise<boolean> {
  const tolerance = 2; 
  
  const dateDebutMoins = new Date(dateDebut);
  dateDebutMoins.setHours(dateDebutMoins.getHours() - tolerance);
  
  const dateDebutPlus = new Date(dateDebut);
  dateDebutPlus.setHours(dateDebutPlus.getHours() + tolerance);
  
  const where: Prisma.EvenementWhereInput = {
    equipeId,
    id: { not: evenementId }, 
    dateDebut: {
      gte: dateDebutMoins,
      lte: dateDebutPlus
    }
  };
  
  if (typeEvenement) {
    where.typeEvenement = typeEvenement;
  }

  const evenementsExistants = await prisma.evenement.findMany({
    where,
    select: { id: true, titre: true, dateDebut: true }
  });
  
  return evenementsExistants.length > 0 ? true : false;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { idEquipe: string, idevenement: string } }
) {
  try {
    const { idEquipe, idevenement } = await params;
    
    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        equipeId: idEquipe,
        userId: idUtilisateur,
        role: { in: ["ENTRAINEUR", "JOUEUR"] }
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { error: "Vous n'êtes pas membre de cette équipe" },
        { status: 403 }
      );
    }

    const evenement = await prisma.evenement.findUnique({
      where: { 
        id: idevenement,
        equipeId: idEquipe 
      },
      include: {
        presences: {
          where: { userId: idUtilisateur },
          select: { id: true, statut: true }
        }
      }
    });

    if (!evenement) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

 
    const evenementFormate = {
      ...evenement,
      dateDebutFormatee: dayjs(evenement.dateDebut).format("dddd D MMMM YYYY à HH:mm"),
      maPresence: evenement.presences[0] || null
    };

    return NextResponse.json(evenementFormate);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'événement" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { idEquipe: string, idevenement: string } }
) {
  try {
    const { idEquipe, idevenement } = params;

 
    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        equipeId: idEquipe,
        userId: idUtilisateur,
        role: "ENTRAINEUR",
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier cet événement" },
        { status: 403 }
      );
    }
e
    const evenement = await prisma.evenement.findUnique({
      where: { 
        id: idevenement,
        equipeId: idEquipe
      },
      select: { typeEvenement: true, dateDebut: true }
    });

    if (!evenement) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }


    const body = await req.json();
    const parsedData = updateEvenementSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsedData.error.format() },
        { status: 400 }
      );
    }

    const updateData: Prisma.EvenementUpdateInput = {};
    
    if (parsedData.data.titre) updateData.titre = parsedData.data.titre;
    if (parsedData.data.description !== undefined) updateData.description = parsedData.data.description;
    if (parsedData.data.lieu !== undefined) updateData.lieu = parsedData.data.lieu;
    if (parsedData.data.typeEvenement) updateData.typeEvenement = parsedData.data.typeEvenement;
    
    let nouvelleDate = evenement.dateDebut;
    
    if (parsedData.data.date || parsedData.data.heure) {
      const dateActuelle = dayjs(evenement.dateDebut);
      let nouvelleDateObj = dateActuelle;
      
      if (parsedData.data.date) {
        nouvelleDateObj = dayjs(parsedData.data.date)
          .hour(dateActuelle.hour())
          .minute(dateActuelle.minute());
      }
      
      if (parsedData.data.heure) {
        const [heures, minutes] = parsedData.data.heure.split(":").map(Number);
        nouvelleDateObj = nouvelleDateObj
          .hour(heures)
          .minute(minutes);
      }
      
      nouvelleDate = nouvelleDateObj.toDate();
      
      const typeEvenement = parsedData.data.typeEvenement || evenement.typeEvenement;
      const evenementExiste = await evenementExisteDejaALaMemeHeure(
        idEquipe, 
        nouvelleDate, 
        idevenement, 
        typeEvenement as "MATCH" | "ENTRAINEMENT"
      );
      
      if (evenementExiste) {
        return NextResponse.json(
          { 
            error: "Un événement existe déjà à une heure proche",
            message: `Un ${typeEvenement === "MATCH" ? "match" : "entraînement"} est déjà programmé autour de cette heure. Veuillez choisir un autre horaire.`
          },
          { status: 409 } 
        );
      }
      updateData.dateDebut = nouvelleDate;
    }

    const evenementMisAJour = await prisma.$transaction(async (tx) => {
      const updatedEvent = await tx.evenement.update({
        where: { id: idevenement },
        data: updateData,
      });
      
      return updatedEvent;
    });

    const evenementFormate = {
      ...evenementMisAJour,
      dateDebutFormatee: dayjs(evenementMisAJour.dateDebut).format("dddd D MMMM YYYY à HH:mm")
    };

    return NextResponse.json(evenementFormate);
  } catch (error) {
    console.error("Erreur lors de la modification de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'événement" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { idEquipe: string, idevenement: string } }
) {
  try {
    const { idEquipe, idevenement } = params;

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        equipeId: idEquipe,
        userId: idUtilisateur,
        role: "ENTRAINEUR",
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cet événement" },
        { status: 403 }
      );
    }

    const evenement = await prisma.evenement.findUnique({
      where: { 
        id: idevenement,
        equipeId: idEquipe
      },
      select: { titre: true }
    });

    if (!evenement) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.presence.deleteMany({
        where: { evenementId: idevenement }
      });

      await tx.statistiqueJoueur.deleteMany({
        where: { evenementId: idevenement }
      });

      await tx.statistiqueEquipe.deleteMany({
        where: { evenementId: idevenement }
      });

      await tx.evenement.delete({
        where: { id: idevenement }
      });
    });

    return NextResponse.json({
      success: true,
      message: `L'événement "${evenement.titre}" a été supprimé avec succès`
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'événement" },
      { status: 500 }
    );
  }
}