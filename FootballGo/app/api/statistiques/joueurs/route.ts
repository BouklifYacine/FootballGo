import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
   
    const utilisateurs = await prisma.user.findMany({
      where: {
        statsJoueur: {
          some: {}
        }
      },
      include: {
        statsJoueur: true,
        membreEquipe: {
          include: {
            equipe: {
              select: {
                id: true,
                nom: true,
                logoUrl: true
              }
            }
          }
        }
      }
    });
    
    const statsJoueurs = utilisateurs.map(user => {
      const statsJoueur = user.statsJoueur || [];

      const totalMatchs = statsJoueur.length;
      const matchsTitulaire = statsJoueur.filter(stat => stat.titulaire).length;
      const totalButs = statsJoueur.reduce((sum, stat) => sum + stat.buts, 0);
      const totalPasses = statsJoueur.reduce((sum, stat) => sum + stat.passesdécisive, 0);
      const GA = totalButs + totalPasses;
      
      let tempsJeuTotal = 0;
      statsJoueur.forEach(stat => {
        tempsJeuTotal += stat.minutesJouees || (stat.titulaire ? 90 : 30);
      });
      
      const butsPar90 = tempsJeuTotal > 0 ? (totalButs / tempsJeuTotal) * 90 : 0;
      const passesPar90 = tempsJeuTotal > 0 ? (totalPasses / tempsJeuTotal) * 90 : 0;
      const GAPar90 = butsPar90 + passesPar90;

      let noteMoyenne = 0;
      if (totalMatchs > 0) {
        noteMoyenne = statsJoueur.reduce((sum, stat) => sum + stat.note, 0) / totalMatchs;
      }
      
      const postesJoues = {
        GARDIEN: 0,
        DEFENSEUR: 0,
        MILIEU: 0,
        ATTAQUANT: 0
      };
      
      statsJoueur.forEach(stat => {
        postesJoues[stat.poste]++;
      });
      
      const posteFrequent = Object.entries(postesJoues)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, count]) => count > 0)
        .map(([poste]) => poste)[0] || null;
      

      const arrondir = (n : number) => Math.round(n * 100) / 100;
      
      return {
        joueur: {
          id: user.id,
          nom: user.name,
          image: user.image
        },
        equipe: user.membreEquipe?.equipe || null,
        stats: {
          totalMatchs,
          matchsTitulaire,
          totalButs,
          totalPasses,
          GA,
          GA_Match: arrondir(GA / totalMatchs) || 0,
          noteMoyenne: arrondir(noteMoyenne),
          posteFrequent,
          tempsJeuTotal,
          butsPar90: arrondir(butsPar90),
          passesPar90: arrondir(passesPar90),
          GAPar90: arrondir(GAPar90)
        }
      };
    });
    
    const classementButeurs = [...statsJoueurs]
      .filter(j => j.stats.totalButs > 0)
      .sort((a, b) => b.stats.totalButs - a.stats.totalButs);
      
    const classementPasseurs = [...statsJoueurs]
      .filter(j => j.stats.totalPasses > 0)
      .sort((a, b) => b.stats.totalPasses - a.stats.totalPasses);
      
    const classementContributeurs = [...statsJoueurs]
      .filter(j => j.stats.GA > 0)
      .sort((a, b) => b.stats.GA - a.stats.GA);
      
    const classementNotes = [...statsJoueurs]
      .filter(j => j.stats.totalMatchs >= 5) 
      .sort((a, b) => b.stats.noteMoyenne - a.stats.noteMoyenne);
    
    const gardiens = statsJoueurs.filter(j => j.stats.posteFrequent === "GARDIEN");
    const defenseurs = statsJoueurs.filter(j => j.stats.posteFrequent === "DEFENSEUR");
    const milieux = statsJoueurs.filter(j => j.stats.posteFrequent === "MILIEU");
    const attaquants = statsJoueurs.filter(j => j.stats.posteFrequent === "ATTAQUANT");
    
    return NextResponse.json({
      totalJoueurs: statsJoueurs.length,
      meilleurs: {
        buteurs: classementButeurs.slice(0, 20),
        passeurs: classementPasseurs.slice(0, 20),
        contributeurs: classementContributeurs.slice(0, 20),
        notes: classementNotes.slice(0, 20)
      },
      parPoste: {
        gardiens: gardiens.sort((a, b) => b.stats.noteMoyenne - a.stats.noteMoyenne).slice(0, 10),
        defenseurs: defenseurs.sort((a, b) => b.stats.noteMoyenne - a.stats.noteMoyenne).slice(0, 10),
        milieux: milieux.sort((a, b) => b.stats.noteMoyenne - a.stats.noteMoyenne).slice(0, 10),
        attaquants: attaquants.sort((a, b) => b.stats.noteMoyenne - a.stats.noteMoyenne).slice(0, 10)
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques des joueurs:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}