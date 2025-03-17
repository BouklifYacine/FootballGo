import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {  StatistiqueEquipeReponse } from "../(types)/types";

export function useStatistiqueEquipeFDP(id: string) {
  return useQuery({
    queryKey: ["statistique-equipe", id],
    queryFn: async () => {
      const { data } = await axios.get<StatistiqueEquipeReponse>(
        `/api/user/${id}/statistiquesteamFDP`
      );
      return data.StatistiqueEquipe;
    },
    enabled: !!id,
  });
}
