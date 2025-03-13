// (hooks)/UseEvenement-Equipe.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvenementsEquipe } from "../(server-actions)/EvenementEquipe-Actions";
import { FiltreEvenements } from "@/app/(schema)/SchemaEvenementv2";
import { EvenementListeSuccessResponse } from "../(types)/EvenementsResponse";

export function useEvenementsEquipe(equipeId: string, filtres: FiltreEvenements = {}) {
  return useQuery<EvenementListeSuccessResponse, Error>({
    queryKey: ["evenements-equipe", equipeId, filtres],
    queryFn: async () => {
      const result = await getEvenementsEquipe(equipeId, filtres);
      
      if (!result.success) {
        throw new Error(result.message || "Erreur lors de la récupération des événements");
      }
      
      return {
        success: true,
        evenementsAVenir: result.evenementsAVenir || [],
        evenementsPassés: result.evenementsPassés || [],
        pagination: result.pagination || {
          total: 0,
          pages: 0,
          page: 1,
          limit: 20
        }
      };
    },
    enabled: !!equipeId,
    refetchOnWindowFocus: false,
  });
}