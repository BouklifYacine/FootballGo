/

export type Joueur = {
    id: string;
    nom: string;
    image: string | null;
  };
  
  export type Equipe = {
    id: string;
    nom: string;
    logoUrl: string | null;
  } | null;
  
  export type StatsJoueur = {
    totalMatchs: number;
    matchsTitulaire: number;
    totalButs: number;
    totalPasses: number;
    GA: number;
    GA_Match: number;
    noteMoyenne: number;
    posteFrequent: string | null;
    tempsJeuTotal: number;
    butsPar90: number;
    passesPar90: number;
    GAPar90: number;
  };
  
  export type JoueurAvecStats = {
    joueur: Joueur;
    equipe: Equipe;
    stats: StatsJoueur;
  };
  
  export type StatsResponse = {
    totalJoueurs: number;
    meilleurs: {
      buteurs: JoueurAvecStats[];
      passeurs: JoueurAvecStats[];
      contributeurs: JoueurAvecStats[];
      notes: JoueurAvecStats[];
    };
    parPoste: {
      gardiens: JoueurAvecStats[];
      defenseurs: JoueurAvecStats[];
      milieux: JoueurAvecStats[];
      attaquants: JoueurAvecStats[];
    };
  };