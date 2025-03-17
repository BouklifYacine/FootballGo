
export enum Poste {
    GARDIEN = "GARDIEN",
    DEFENSEUR = "DEFENSEUR",
    MILIEU = "MILIEU",
    ATTAQUANT = "ATTAQUANT"
  }
  
  export interface StatistiquesGlobales {
    totalMatchs: number;
    totalButs: number;
    totalPasses: number;
    matchsTitulaire: number;
    noteMoyenne: number;
    GA_TOTAL: number;
    GA_Match: string | number;
    tempsJeuTotal: number;
    butsPar90: string;
    passesPar90: string;
    GAPar90: string;
  }
  
  export interface DetailMatch {
    matchId: string;
    titre: string;
    date: Date;
    equipe: string;
    buts: number;
    passes: number;
    note: number;
    poste: Poste;
    titulaire: boolean;
    minutesJouees: number;
  }
  
  export interface StatsParPoste {
    GARDIEN: number;
    DEFENSEUR: number;
    MILIEU: number;
    ATTAQUANT: number;
  }

  export interface StatistiquesJoueurResponse {
    statistiquesGlobales: StatistiquesGlobales;
    // Décommentez ces lignes quand je ferais la V2
    // statsParPoste: StatsParPoste;
    // detailMatchs: DetailMatch[];
  }
  
  export interface APIErrorResponse {
    message: string;
  }