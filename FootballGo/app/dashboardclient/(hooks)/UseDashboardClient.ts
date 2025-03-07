import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { StatsResponse } from "../(interface-types)/StatsJoueur";

export function useClassementJoueurs() {
  return useQuery({
    queryKey: ["classement-joueurs"],
    queryFn: async () => {
      const { data } = await axios.get<StatsResponse>("/api/statistiques/joueurs");
      return data;
    },
  });
}