import { useQuery } from "@tanstack/react-query";
import { StatistiquesJoueurResponse } from "../(types)/types";
import axios from "axios";

export function useStatistiqueJoueur(id: string) {
  return useQuery({
    queryKey: ["statistique-joueur", id],
    queryFn: async () => {
      const { data } = await axios.get<StatistiquesJoueurResponse>(
        `/api/user/${id}/statistiques`
      );
      return data.statistiquesGlobales; 
    },
    enabled: !!id, 
  });
}