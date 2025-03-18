// Types pour les statistiques d'équipe
export type ResultatMatch = "VICTOIRE" | "DEFAITE" | "MATCH_NUL";
export type Competition = "CHAMPIONNAT" | "COUPE";

export interface StatistiqueEquipe {
  id: string;
  evenementId: string;
  equipeId: string;
  resultatMatch: ResultatMatch;
  butsMarques: number;
  butsEncaisses: number;
  cleanSheet: boolean;
  tirsTotal?: number | null;
  tirsCadres?: number | null;
  domicile: boolean;
  competition: Competition;
  adversaire: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatistiqueEquipeReponse {
  StatistiqueEquipe: StatistiqueEquipe[];
}

export interface ServerActionResponse {
  success: boolean;
  message: string;
  statistiques?: {
    id: string;
    resultatMatch: ResultatMatch;
    butsMarques: number;
    butsEncaisses: number;
    cleanSheet: boolean;
    tirsTotal?: number | null;
    tirsCadres?: number | null;
    domicile: boolean;
    competition: Competition;
    adversaire: string;
    [key: string]: unknown; // Pour les champs additionnels retournés par Prisma
  };
  erreurs?: unknown;
}