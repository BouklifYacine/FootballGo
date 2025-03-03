import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

interface JoueurStat {
  joueur: {
    id: string;
    name: string | null;
    image: string | null;
  };
  matchs: number;
  titulaire: number;
  buts: number;
  passes: number;
  GA: number;
  notes: number[];
  noteMoyenne?: string;
  GA_Match?: string;
}

// Index signature pour l'objet joueurStats
interface JoueurStatsMap {
  [key: string]: JoueurStat;
}

const idUtilisateurConnecte = "cm7sthoee0001irowu7bczcjg";

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  
  try {
    const equipe = await prisma.equipe.findUnique({
      where: { id: id },
      include: {
        membres: true
      }
    });

    if (!equipe) {
      return NextResponse.json(
        { message: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    const estMembre = equipe.membres.some(membre => membre.userId === idUtilisateurConnecte);
    
    if (!estMembre) {
      return NextResponse.json(
        { message: "Vous n'êtes pas membre de cette équipe" },
        { status: 403 }
      );
    }

    const statsEquipe = await prisma.statistiqueEquipe.findMany({
        where: { equipeId: id },
        include: {
          evenement: {
            select: {
              titre: true,
              dateDebut: true
            }
          }
        }
      });

    const membres = await prisma.membreEquipe.findMany({
        where: { equipeId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      });

    const idsJoueurs = membres.map(membre => membre.userId);
    
    const statsJoueurs = await prisma.statistiqueJoueur.findMany({
        where: {
          userId: { in: idsJoueurs },
          evenement: { equipeId: id }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          evenement: {
            select: {
              id: true,
              titre: true,
              dateDebut: true
            }
          }
        }
      });


    const totalMatchs = statsEquipe.length;
    const victoires = statsEquipe.filter(stat => stat.resultatMatch === "VICTOIRE").length;
    const defaites = statsEquipe.filter(stat => stat.resultatMatch === "DEFAITE").length;
    const nuls = statsEquipe.filter(stat => stat.resultatMatch === "MATCH_NUL").length;
    const butsMarques = statsEquipe.reduce((sum, stat) => sum + stat.butsMarques, 0);
    const butsEncaisses = statsEquipe.reduce((sum, stat) => sum + stat.butsEncaisses, 0);
    const differenceDeButsGlobale = butsMarques - butsEncaisses;
    const cleanSheets = statsEquipe.filter(stat => stat.cleanSheet).length;
    
    const points = (victoires * 3) + nuls;
    
    // Calculer le pourcentage de victoires
    const tauxVictoire = totalMatchs > 0 ? Math.round((victoires / totalMatchs) * 100) : 0;
    
    // Calculer les moyennes par match
    const moyenneButsMarques = totalMatchs > 0 ? (butsMarques / totalMatchs).toFixed(2) : "0";
    const moyenneButsEncaisses = totalMatchs > 0 ? (butsEncaisses / totalMatchs).toFixed(2) : "0";

    // Regrouper les stats des joueurs
    const joueurStats: JoueurStatsMap = {};
    
    statsJoueurs.forEach(stat => {
      const userId = stat.user.id;
      
      if (!joueurStats[userId]) {
        joueurStats[userId] = {
          joueur: stat.user,
          matchs: 0,
          titulaire: 0,
          buts: 0,
          passes: 0,
          GA: 0,
          notes: []
        };
      }
      
      joueurStats[userId].matchs++;
      if (stat.titulaire) joueurStats[userId].titulaire++;
      joueurStats[userId].buts += stat.buts;
      joueurStats[userId].passes += stat.passesdécisive;
      joueurStats[userId].GA += (stat.buts + stat.passesdécisive);
      joueurStats[userId].notes.push(stat.note);
    });
    
    const classementJoueurs = Object.values(joueurStats).map(joueur => {
      const noteMoyenne = joueur.notes.length > 0 
        ? (joueur.notes.reduce((a, b) => a + b, 0) / joueur.notes.length).toFixed(2) 
        : "0";
      
      return {
        ...joueur,
        noteMoyenne,
        GA_Match: joueur.matchs > 0 ? (joueur.GA / joueur.matchs).toFixed(2) : "0",
        notes: undefined 
      };
    });
    
    const classementButeurs = [...classementJoueurs].sort((a, b) => b.buts - a.buts);
    const classementPasseurs = [...classementJoueurs].sort((a, b) => b.passes - a.passes);
    const classementGA = [...classementJoueurs].sort((a, b) => b.GA - a.GA);
    
    const reponse = {
      equipe: {
        id: equipe.id,
        nom: equipe.nom,
        logo: equipe.logoUrl
      },
      statistiquesGlobales: {
        points,
        totalMatchs,
        victoires,
        nuls,
        defaites,
        butsMarques,
        butsEncaisses,
        differenceDeButsGlobale,
        cleanSheets,
        tauxVictoire,
        moyenneButsMarques,
        moyenneButsEncaisses
      },
      classements: {
        buteurs: classementButeurs.slice(0, 5),
        passeurs: classementPasseurs.slice(0, 5),
        contributeurs: classementGA.slice(0, 5)
      },
      detailMatchs: statsEquipe.map(stat => ({
        id: stat.id,
        matchId: stat.evenementId,
        titre: stat.evenement?.titre || "Match sans titre",
        date: stat.evenement?.dateDebut,
        adversaire: stat.adversaire,
        resultat: stat.resultatMatch,
        score: `${stat.butsMarques}-${stat.butsEncaisses}`,
        domicile: stat.domicile,
        competition: stat.competition
      }))
    };
    
    return NextResponse.json(reponse);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques d'équipe:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}