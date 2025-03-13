// (server-actions)/EvenementEquipe-actions.ts
"use server";

import dayjs from "dayjs";
import "dayjs/locale/fr";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import {
  EvenementListeErrorResponse,
  EvenementListeResponse,
  EvenementListeSuccessResponse,
} from "../(types)/EvenementsResponse";
import {
  FiltreEvenements,
  filtreEvenementsSchema,
} from "@/app/(schema)/SchemaEvenementv2";

dayjs.locale("fr");

export async function getEvenementsEquipe(
  equipeId: string,
  filtres: FiltreEvenements = {}
): Promise<EvenementListeResponse> {
  try {
    // Validation des filtres
    const validationFiltres = filtreEvenementsSchema.safeParse(filtres);
    if (!validationFiltres.success) {
      const errorResponse: EvenementListeErrorResponse = {
        success: false,
        message: "Filtres invalides"
      };
      return errorResponse;
    }

    // Récupération de l'utilisateur connecté
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      const errorResponse: EvenementListeErrorResponse = {
        success: false, 
        message: "Vous devez être connecté" 
      };
      return errorResponse;
    }

    // Vérification que l'utilisateur est membre de l'équipe
    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId,
        equipeId,
        role: { in: ["ENTRAINEUR", "JOUEUR"] },
      },
    });

    if (!membreEquipe) {
      const errorResponse: EvenementListeErrorResponse = {
        success: false,
        message: "Vous n'êtes pas membre de cette équipe"
      };
      return errorResponse;
    }

    // Gestion des paramètres de pagination avec limite par défaut à 5
    const limit = filtres.limit || 5;
    const page = filtres.page || 1;
    const skip = (page - 1) * limit;

    // Construction de la requête WHERE
    const where: Prisma.EvenementWhereInput = { equipeId };

    if (filtres.debut || filtres.fin) {
      where.dateDebut = {};

      if (filtres.debut) {
        where.dateDebut.gte = new Date(filtres.debut);
      }

      if (filtres.fin) {
        where.dateDebut.lte = new Date(filtres.fin);
      }
    }

    if (filtres.type && filtres.type !== "TOUS") {
      where.typeEvenement = filtres.type;
    }

    // Récupération des événements
    const evenements = await prisma.evenement.findMany({
      where,
      orderBy: { dateDebut: "asc" },
      skip,
      take: limit,
      include: {
        presences: {
          where: { userId },
          select: { id: true, statut: true },
        },
      },
    });

    // Comptage du total d'événements pour la pagination
    const total = await prisma.evenement.count({ where });

    // Formatage des événements
    const evenementsFormates = evenements.map((evenement) => {
      const dateObj = dayjs(evenement.dateDebut);

      return {
        ...evenement,
        dateDebutFormatee: dateObj.format("dddd D MMMM YYYY à HH:mm"),
        date: dateObj.format("YYYY-MM-DD"),
        heure: dateObj.format("HH:mm"),
        maPresence: evenement.presences[0] || null,
      };
    });

    // Distinction entre événements à venir et passés
    const maintenant = new Date();
    const evenementsAVenir = evenementsFormates.filter(
      e => new Date(e.dateDebut) > maintenant
    );
    const evenementsPassés = evenementsFormates.filter(
      e => new Date(e.dateDebut) <= maintenant
    );

    const successResponse: EvenementListeSuccessResponse = {
      success: true,
      evenementsAVenir,
      evenementsPassés,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      }
    };
    
    return successResponse;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    const errorResponse: EvenementListeErrorResponse = {
      success: false,
      message: "Erreur lors de la récupération des événements"
    };
    return errorResponse;
  }
}
