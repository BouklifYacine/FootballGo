export interface StatistiqueEquipe {
  points: number;
  totalMatchs: number;
  victoires: number;
  nuls: number;
  defaites: number;
  butsMarques: number;
  butsEncaisses: number;
  differenceDeButsGlobale: number;
  cleanSheets: number;
  tauxVictoire: number;
  moyenneButsMarques: number;
  moyenneButsEncaisses: number;
}


export interface StatistiqueEquipeReponse {
  StatistiqueEquipe: StatistiqueEquipe
}