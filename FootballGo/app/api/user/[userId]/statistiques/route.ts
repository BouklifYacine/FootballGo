import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { userId: string };
}

const idUtilisateurConnecte = "cm7sthoee0001irowu7bczcjg";

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { userId } = params;
  
  try {
    const utilisateur = await prisma.user.findUnique({
      where: { id: userId },
      include: { membreEquipe: true }
    });

    if (!utilisateur) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (userId !== idUtilisateurConnecte) {
      if (!utilisateur.membreEquipe) {
        return NextResponse.json(
          { message: "Cet utilisateur n'appartient à aucune équipe" },
          { status: 403 }
        );
      }

      const membreMemeEquipe = await prisma.membreEquipe.findFirst({
        where: {
          userId: idUtilisateurConnecte,
          equipeId: utilisateur.membreEquipe.equipeId
        }
      });

      if (!membreMemeEquipe) {
        return NextResponse.json(
          { message: "Vous n'êtes pas autorisé à voir les statistiques de ce joueur" },
          { status: 403 }
        );
      }
    }

    const statistiquesJoueur = await prisma.statistiqueJoueur.findMany({
      where: { userId: userId },
      include: {
        evenement: {
          select: {
            titre: true,
            dateDebut: true,
            equipe: {
              select: {
                nom: true
              }
            }
          }
        }
      }
    });

    const totalMatchs = statistiquesJoueur.length;
    const totalButs = statistiquesJoueur.reduce((sum, stat) => sum + stat.buts, 0);
    const totalPasses = statistiquesJoueur.reduce((sum, stat) => sum + stat.passesdécisive, 0);
    const matchsTitulaire = statistiquesJoueur.filter(stat => stat.titulaire).length;
    const GA_TOTAL = totalButs + totalPasses;
    
   
let tempsJeuTotal = 0;
statistiquesJoueur.forEach(stat => {

  if (stat.minutesJouees && stat.minutesJouees > 0) {
    tempsJeuTotal += stat.minutesJouees;
  } else {

    tempsJeuTotal += stat.titulaire ? 90 : 30;
  }
});

    const butsParMinute = tempsJeuTotal > 0 ? totalButs / tempsJeuTotal : 0;
    const passesParMinute = tempsJeuTotal > 0 ? totalPasses / tempsJeuTotal : 0;

    const butsPar90 = butsParMinute * 90;
    const passesPar90 = passesParMinute * 90;
    const GAPar90 = (butsParMinute + passesParMinute) * 90;
    
    const arrondir = (nombre : number) => Math.round(nombre * 100) / 100;
    
    const GA_Match = totalMatchs > 0 ? arrondir(GA_TOTAL / totalMatchs) : 0;
    
    let noteMoyenne = 0;
    if (totalMatchs > 0) {
      noteMoyenne = statistiquesJoueur.reduce((sum, stat) => sum + stat.note, 0) / totalMatchs;
      noteMoyenne = arrondir(noteMoyenne);
    }

    const statsParPoste = {
      GARDIEN: 0,
      DEFENSEUR: 0,
      MILIEU: 0,
      ATTAQUANT: 0
    };

    statistiquesJoueur.forEach(stat => {
      statsParPoste[stat.poste]++;
    });

    const statsAggregees = {
      joueur: {
        id: utilisateur.id,
        nom: utilisateur.name,
        image: utilisateur.image
      },
      statistiquesGlobales: {
        totalMatchs,
        totalButs,
        totalPasses,
        matchsTitulaire,
        noteMoyenne,
        GA_TOTAL,
        GA_Match,
        tempsJeuTotal,
        butsPar90: arrondir(butsPar90),
        passesPar90: arrondir(passesPar90),
        GAPar90: arrondir(GAPar90)
      },
      statsParPoste,
      detailMatchs: statistiquesJoueur.map(stat => ({
        matchId: stat.evenementId,
        titre: stat.evenement.titre,
        date: stat.evenement.dateDebut,
        equipe: stat.evenement.equipe.nom,
        buts: stat.buts,
        passes: stat.passesdécisive,
        note: stat.note,
        poste: stat.poste,
        titulaire: stat.titulaire,
        minutesJouees: stat.minutesJouees || (stat.titulaire ? 90 : 30)
      }))
    };

    return NextResponse.json(statsAggregees);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}