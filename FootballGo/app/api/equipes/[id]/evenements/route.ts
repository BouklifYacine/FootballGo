import { NextRequest, NextResponse } from "next/server";

import dayjs from "dayjs";
import "dayjs/locale/fr";

import {
  evenementSchema,
  type EvenementUnique,
  type EvenementRecurrent,
} from "../../../../(schema)/SchemaEvenement";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";

dayjs.locale("fr");

const idUtilisateur = "cm7stg4000000irowgylbnkpq";

async function evenementExisteDejaALaMemeHeure(
  equipeId: string,
  dateDebut: Date,
  dateFin?: Date,
  typeEvenement?: "MATCH" | "ENTRAINEMENT"
): Promise<boolean> {
  const tolerance = 2;

  const dateDebutMoins = new Date(dateDebut);
  dateDebutMoins.setHours(dateDebutMoins.getHours() - tolerance);

  const dateDebutPlus = new Date(dateDebut);
  dateDebutPlus.setHours(dateDebutPlus.getHours() + tolerance);

  const where: Prisma.EvenementWhereInput = {
    equipeId,
    dateDebut: {
      gte: dateDebutMoins,
      lte: dateDebutPlus,
    },
  };

  if (typeEvenement) {
    where.typeEvenement = typeEvenement;
  }

  const evenementsExistants = await prisma.evenement.findMany({
    where,
    select: { id: true, titre: true, dateDebut: true },
  });

  return evenementsExistants.length > 0 ? true : false;
}

async function creerEvenementUnique(
  donnees: EvenementUnique,
  equipeId: string
) {
  try {
    const [heures, minutes] = donnees.heure.split(":").map(Number);

    const dateCourante = dayjs(donnees.date);
    const dateEvenement = dateCourante
      .hour(heures)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toDate();

    const evenementExiste = await evenementExisteDejaALaMemeHeure(
      equipeId,
      dateEvenement,
      undefined,
      donnees.typeEvenement
    );

    if (evenementExiste) {
      return NextResponse.json(
        {
          error: "Un événement existe déjà à une heure proche",
          message: `Un ${donnees.typeEvenement === "MATCH" ? "match" : "entraînement"} est déjà programmé autour de cette heure. Veuillez choisir un autre horaire.`,
        },
        { status: 409 }
      );
    }

    const nouvelEvenement = await prisma.$transaction(async (tx) => {
      const evenement = await tx.evenement.create({
        data: {
          titre: donnees.titre,
          description: donnees.description || null,
          lieu: donnees.lieu || null,
          typeEvenement: donnees.typeEvenement,
          dateDebut: dateEvenement,
          equipeId,
        },
      });

      return evenement;
    });

    const evenementFormate = {
      ...nouvelEvenement,
      dateDebutFormatee: dayjs(nouvelEvenement.dateDebut).format(
        "dddd D MMMM YYYY à HH:mm"
      ),
    };

    return NextResponse.json(evenementFormate, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'événement" },
      { status: 500 }
    );
  }
}

async function creerEvenementsRecurrents(
  donnees: EvenementRecurrent,
  equipeId: string
) {
  try {
    const dateDebut = dayjs(donnees.date).startOf("day");
    const dateFin = dayjs(donnees.dateFin).endOf("day");

    if (dateFin.isBefore(dateDebut)) {
      return NextResponse.json(
        { error: "La date de fin doit être après la date de début" },
        { status: 400 }
      );
    }

    const [heures, minutes] = donnees.heure.split(":").map(Number);

    type EvenementCreate = Prisma.EvenementCreateManyInput;

    const evenementsACreer: EvenementCreate[] = [];
    const evenementsConflits: { date: string; dateFormatee: string }[] = [];

    let dateCourante = dateDebut;

    while (
      dateCourante.isBefore(dateFin) ||
      dateCourante.isSame(dateFin, "day")
    ) {
      const jourSemaine = dateCourante.day();

      if (donnees.jours.includes(jourSemaine)) {
        const dateEvenement = dateCourante
          .hour(heures)
          .minute(minutes)
          .second(0)
          .millisecond(0);

        const evenementExiste = await evenementExisteDejaALaMemeHeure(
          equipeId,
          dateEvenement.toDate(),
          undefined,
          donnees.typeEvenement
        );

        if (evenementExiste) {
          evenementsConflits.push({
            date: dateEvenement.format("YYYY-MM-DD"),
            dateFormatee: dateEvenement.format("dddd D MMMM YYYY"),
          });
        } else {
          evenementsACreer.push({
            titre: donnees.titre,
            description: donnees.description || null,
            lieu: donnees.lieu || null,
            typeEvenement: donnees.typeEvenement,
            dateDebut: dateEvenement.toDate(),
            equipeId,
          });
        }
      }

      dateCourante = dateCourante.add(1, "day");
    }

    if (evenementsACreer.length === 0) {
      if (evenementsConflits.length > 0) {
        return NextResponse.json(
          {
            error: "Conflits d'horaires pour tous les événements",
            conflits: evenementsConflits,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Aucun événement à créer avec les critères sélectionnés" },
        { status: 400 }
      );
    }

    const resultats = await prisma.$transaction(async (tx) => {
      const creationResultat = await tx.evenement.createMany({
        data: evenementsACreer,
      });

      return creationResultat;
    });

    const joursNoms = donnees.jours.map((jour) => {
      const joursDeLaSemaine = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ];
      return joursDeLaSemaine[jour];
    });

    if (evenementsConflits.length > 0) {
      return NextResponse.json(
        {
          message: `${resultats.count} événements créés avec succès (${evenementsConflits.length} conflits ignorés)`,
          nombreEvenements: resultats.count,
          details: {
            jours: joursNoms,
            heure: donnees.heure,
            periode: `Du ${dateDebut.format("DD/MM/YYYY")} au ${dateFin.format("DD/MM/YYYY")}`,
          },
          conflits: evenementsConflits,
        },
        { status: 207 }
      );
    }

    return NextResponse.json(
      {
        message: `${resultats.count} événements créés avec succès`,
        nombreEvenements: resultats.count,
        details: {
          jours: joursNoms,
          heure: donnees.heure,
          periode: `Du ${dateDebut.format("DD/MM/YYYY")} au ${dateFin.format("DD/MM/YYYY")}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la création des événements récurrents:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la création des événements récurrents" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equipeId = await params.id;

    // Vérification du rôle d'entraîneur avec l'ID codé en dur
    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        equipeId,
        userId: idUtilisateur,
        role: "ENTRAINEUR",
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { error: "Seuls les entraîneurs peuvent créer des événements" },
        { status: 403 }
      );
    }

    // Validation des données avec ZOD
    const body = await req.json();
    const resultatValidation = evenementSchema.safeParse(body);

    if (!resultatValidation.success) {
      // Retourner les erreurs de validation de manière lisible
      return NextResponse.json(
        {
          error: "Données invalides",
          details: resultatValidation.error.format(),
        },
        { status: 400 }
      );
    }

    const donnees = resultatValidation.data;

    // Création des événements (unique ou récurrents)
    if (donnees.recurrent === true) {
      return await creerEvenementsRecurrents(donnees, equipeId);
    } else {
      return await creerEvenementUnique(donnees, equipeId);
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'événement" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { idEquipe: string } }
) {
  try {
    const equipeId = await params.idEquipe;

    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        equipeId,
        userId: idUtilisateur,
        role: { in: ["ENTRAINEUR", "JOUEUR"] },
      },
    });

    if (!membreEquipe) {
      return NextResponse.json(
        { error: "Vous n'êtes pas membre de cette équipe" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const debut = url.searchParams.get("debut");
    const fin = url.searchParams.get("fin");
    const type = url.searchParams.get("type");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where: Prisma.EvenementWhereInput = { equipeId };

    if (debut || fin) {
      where.dateDebut = {};

      if (debut) {
        where.dateDebut.gte = new Date(debut);
      }

      if (fin) {
        where.dateDebut.lte = new Date(fin);
      }
    }

    if (type && ["MATCH", "ENTRAINEMENT"].includes(type)) {
      where.typeEvenement = type as "MATCH" | "ENTRAINEMENT";
    }

    const evenements = await prisma.evenement.findMany({
      where,
      orderBy: { dateDebut: "asc" },
      skip,
      take: limit,
      include: {
        presences: {
          where: { userId: idUtilisateur },
          select: { id: true, statut: true },
        },
      },
    });

    const total = await prisma.evenement.count({ where });

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

    return NextResponse.json({
      evenements: evenementsFormates,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des événements" },
      { status: 500 }
    );
  }
}
